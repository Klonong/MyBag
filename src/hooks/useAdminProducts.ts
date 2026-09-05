"use client";

import { useState } from "react";
import { productsService } from "@/services/products.service";
import type { ProductDetail } from "@/interfaces";
import { adminProducts } from "@/data/admin-mock";
import { useAsyncData } from "@/hooks/useAsyncData";

export const money = (value: string | number | null | undefined) =>
  `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

export const productStock = (product: ProductDetail) =>
  (product.product_colors ?? []).reduce((sum, color) => sum + Number(color.stock ?? 0), 0);

const CATALOG_FETCH_LIMIT = 100;

export const useAdminProducts = () => {
  const {
    data: products,
    setData: setProducts,
    loading,
    error,
    setError,
  } = useAsyncData(() => productsService.getProductList({ page: 1, limit: CATALOG_FETCH_LIMIT }), [], {
    initial: [] as ProductDetail[],
    select: (result): ProductDetail[] =>
      result.data?.items?.length ? result.data.items : (adminProducts as ProductDetail[]),
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function removeProduct(id: string) {
    setDeletingId(id);
    const result = await productsService.deleteProduct(id);
    if (result.error) {
      setError(result.error.message);
    } else {
      setProducts((current) => current.filter((product) => product.id !== id));
    }
    setDeletingId(null);
    return !result.error;
  }

  async function removeProducts(ids: string[]) {
    const results = await Promise.all(ids.map((id) => productsService.deleteProduct(id)));
    const failed = results.some((result) => result.error);
    if (failed) setError("Some products could not be deleted.");
    setProducts((current) => current.filter((product) => !ids.includes(product.id)));
    return !failed;
  }

  return {
    products,
    loading,
    error,
    deletingId,
    removeProduct,
    removeProducts,
  };
};
