"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Box, CircleAlert, PackageCheck, Plus, ShoppingBag, Users } from "lucide-react";
import { productsService } from "@/services/products.service";
import type { ProductDetail } from "@/interfaces";
import { adminProducts } from "@/data/admin-mock";

const money = (value: string | number | null | undefined) =>
  `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void productsService.getProductList({ limit: 100 }).then((result) => {
      setProducts(result.data?.items?.length ? result.data.items : adminProducts);
      setLoading(false);
    });
  }, []);

  const stock = products.reduce((total, product) => total + (product.product_colors ?? []).reduce((sum, color) => sum + Number(color.stock ?? 0), 0), 0);
  const lowStock = products.filter((product) => (product.product_colors ?? []).reduce((sum, color) => sum + Number(color.stock ?? 0), 0) < 5);
  const discounted = products.filter((product) => Number(product.discount ?? 0) > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Wednesday, September 3, 2026</p>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Good morning.</h1>
          <p className="mt-2 text-sm text-zinc-500">Here is what is happening across your store.</p>
        </div>
        <Link href="/admin/create-product" className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
          <Plus className="size-4" /> Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Catalog items", value: loading ? "—" : products.length, note: "Published products", icon: ShoppingBag },
          { label: "Units in stock", value: loading ? "—" : stock, note: "Across all variants", icon: Box },
          { label: "Discounted items", value: loading ? "—" : discounted.length, note: "Active price reductions", icon: PackageCheck },
          { label: "Low stock", value: loading ? "—" : lowStock.length, note: "Needs attention", icon: CircleAlert },
        ].map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">{label}</p><Icon className="size-5 text-tertiary" strokeWidth={1.6} /></div>
            <p className="mt-6 text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-zinc-500">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4"><div><h2 className="font-headline text-2xl font-semibold">Catalog snapshot</h2><p className="mt-1 text-xs text-zinc-500">Your latest products at a glance</p></div><Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-tertiary">View all <ArrowUpRight className="size-3.5" /></Link></div>
          <div className="divide-y divide-zinc-100">
            {products.slice(0, 5).map((product) => {
              const image = product.product_images?.[0]?.image_url;
              const quantity = (product.product_colors ?? []).reduce((sum, color) => sum + Number(color.stock ?? 0), 0);
              return <div key={product.id} className="flex items-center gap-4 px-5 py-4"><div className="size-12 shrink-0 overflow-hidden bg-zinc-100">{image ? <img src={image} alt="" className="size-full object-cover" /> : <div className="flex size-full items-center justify-center"><ShoppingBag className="size-5 text-zinc-300" /></div>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name}</p><p className="mt-1 text-xs text-zinc-500">{product.categories?.name ?? "Uncategorized"}</p></div><div className="text-right"><p className="text-sm font-medium">{money(product.price)}</p><p className={`mt-1 text-xs ${quantity < 5 ? "text-red-500" : "text-zinc-500"}`}>{quantity} units</p></div></div>;
            })}
            {!loading && products.length === 0 && <p className="px-5 py-10 text-center text-sm text-zinc-500">No products found.</p>}
          </div>
        </section>

        <section className="border border-zinc-200 bg-zinc-900 p-6 text-white">
          <Users className="size-6 text-tertiary" strokeWidth={1.6} />
          <h2 className="mt-16 font-headline text-3xl font-semibold">Customer orders</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Order management is ready for the backend order listing endpoint. Connect it here to track fulfilment from one place.</p>
          <Link href="/admin/orders" className="mt-8 inline-flex items-center gap-2 border-b border-tertiary pb-1 text-sm text-tertiary">Open orders module <ArrowUpRight className="size-4" /></Link>
        </section>
      </div>
    </div>
  );
}
