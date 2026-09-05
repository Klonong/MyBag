"use client";

import { useEffect, useState } from "react";
import { adminCustomers, adminOrders, adminProducts } from "@/data/admin-mock";
import {
  adminService,
  type AdminCustomer,
  type AdminOrder,
} from "@/services/admin.service";
import { productsService } from "@/services/products.service";
import type { ProductDetail } from "@/interfaces";

export type Period = "7d" | "30d" | "12m";
export type TrendPoint = {
  label: string;
  revenue: number;
  previous: number;
  orders: number;
};
export type ProductPoint = { name: string; value: number };
export type CategoryPoint = { name: string; value: number };
export type StatusPoint = { name: string; value: number };
export type KpiDatum = {
  label: string;
  value: string | number;
  note: string;
  color: string;
  spark: { value: number }[];
};

export const chartColors = [
  "#e2725b",
  "#263238",
  "#d4a373",
  "#77917c",
  "#9c6644",
  "#a1a1aa",
];

export const money = (value: string | number | null | undefined) =>
  `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

export const numericMoney = (value: string | number | null | undefined) => {
  const number = Number(String(value ?? 0).replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
};

export function getTrendData(orders: AdminOrder[], period: Period): TrendPoint[] {
  const length = period === "7d" ? 7 : period === "30d" ? 30 : 12;
  return Array.from({ length }, (_, index) => {
    const date = new Date();
    if (period === "12m") date.setMonth(date.getMonth() - (length - 1 - index));
    else date.setDate(date.getDate() - (length - 1 - index));
    const key =
      period === "12m"
        ? date.toISOString().slice(0, 7)
        : date.toISOString().slice(0, 10);
    const previousDate = new Date(date);
    if (period === "12m") previousDate.setMonth(previousDate.getMonth() - 12);
    else previousDate.setDate(previousDate.getDate() - length);
    const previousKey =
      period === "12m"
        ? previousDate.toISOString().slice(0, 7)
        : previousDate.toISOString().slice(0, 10);
    const matches = orders.filter((order) => {
      const created = order.created_at ?? order.date;
      return created ? new Date(created).toISOString().startsWith(key) : false;
    });
    const previous = orders.filter((order) => {
      const created = order.created_at ?? order.date;
      return created
        ? new Date(created).toISOString().startsWith(previousKey)
        : false;
    });
    return {
      label:
        period === "12m"
          ? date.toLocaleDateString("en-US", { month: "short" })
          : date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }),
      revenue: matches.reduce(
        (sum, order) => sum + numericMoney(order.total),
        0,
      ),
      previous: previous.reduce(
        (sum, order) => sum + numericMoney(order.total),
        0,
      ),
      orders: matches.length,
    };
  });
}

export function getTopProducts(products: ProductDetail[]): ProductPoint[] {
  return products
    .map((product) => ({
      name: product.name,
      value:
        numericMoney(product.price) *
        Math.max(
          1,
          (product.product_colors ?? []).reduce(
            (sum, color) => sum + Number(color.stock ?? 0),
            0,
          ),
        ),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

export function getCategorySales(products: ProductDetail[]): CategoryPoint[] {
  return Object.entries(
    products.reduce<Record<string, number>>((result, product) => {
      const category = product.categories?.name ?? "Other";
      result[category] = (result[category] ?? 0) + numericMoney(product.price);
      return result;
    }, {}),
  ).map(([name, value]) => ({ name, value }));
}

export const useAdminDashboard = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [period, setPeriod] = useState<Period>("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      productsService.getProductList({ limit: 100 }),
      adminService.listOrders({ limit: 100 }),
      adminService.listCustomers({ limit: 100 }),
    ]).then(([productResult, orderResult, customerResult]) => {
      setProducts(
        productResult.data?.items?.length
          ? productResult.data.items
          : adminProducts,
      );
      setOrders(orderResult.data?.length ? orderResult.data : adminOrders);
      setCustomers(
        customerResult.data?.length ? customerResult.data : adminCustomers,
      );
      setLoading(false);
    });
  }, []);

  const stock = products.reduce(
    (total, product) =>
      total +
      (product.product_colors ?? []).reduce(
        (sum, color) => sum + Number(color.stock ?? 0),
        0,
      ),
    0,
  );
  const lowStock = products.filter(
    (product) =>
      (product.product_colors ?? []).reduce(
        (sum, color) => sum + Number(color.stock ?? 0),
        0,
      ) < 5,
  );
  const trend = getTrendData(orders, period);
  const revenue = trend.reduce((sum, point) => sum + point.revenue, 0);
  const orderCount = trend.reduce((sum, point) => sum + point.orders, 0);
  const fulfillmentRate = orders.length
    ? Math.round(
        (orders.filter((order) =>
          ["shipped", "completed", "delivered"].includes(
            order.status.toLowerCase(),
          ),
        ).length /
          orders.length) *
          100,
      )
    : 0;
  const topProducts = getTopProducts(products);
  const categorySales = getCategorySales(products);
  const statusData: StatusPoint[] = [
    "Pending",
    "Paid",
    "Shipped",
    "Completed",
    "Cancelled",
  ].map((status) => ({
    name: status,
    value: orders.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase(),
    ).length,
  }));

  const kpis: KpiDatum[] = [
    {
      label: "Revenue",
      value: loading ? "—" : money(revenue),
      note: `${orderCount} orders in period`,
      color: "#e2725b",
      spark: trend.map((point) => ({ value: point.revenue })),
    },
    {
      label: "Orders",
      value: loading ? "—" : orderCount,
      note: "Across selected period",
      color: "#263238",
      spark: trend.map((point) => ({ value: point.orders })),
    },
    {
      label: "Customers",
      value: loading ? "—" : customers.length,
      note: "In customer directory",
      color: "#77917c",
      spark: customers.map((_, index) => ({ value: index + 1 })),
    },
    {
      label: "Units in stock",
      value: loading ? "—" : stock,
      note: `${lowStock.length} need attention`,
      color: "#d4a373",
      spark: products
        .slice(0, 7)
        .map((product) => ({
          value: (product.product_colors ?? []).reduce(
            (sum, color) => sum + Number(color.stock ?? 0),
            0,
          ),
        })),
    },
  ];

  return {
    loading,
    period,
    setPeriod,
    products,
    orders,
    customers,
    stock,
    lowStock,
    trend,
    revenue,
    orderCount,
    fulfillmentRate,
    topProducts,
    categorySales,
    statusData,
    kpis,
  };
};
