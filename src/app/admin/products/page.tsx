"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Plus, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { productsService } from "@/services/products.service";
import type { ProductDetail, ProductListMeta } from "@/interfaces";
import { adminProducts } from "@/data/admin-mock";

const money = (value: string | number | null | undefined) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
const emptyMeta: ProductListMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [meta, setMeta] = useState<ProductListMeta>(emptyMeta);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void productsService.getProductList({ page, limit: Number(limit), search }).then((result) => {
      if (result.error && !result.data) setError(null);
      const items = result.data?.items?.length ? result.data.items : adminProducts;
      setProducts(items);
      setMeta(result.data?.meta ?? { page, limit: Number(limit), total: items.length, totalPages: 1 });
      setLoading(false);
    });
  }, [page, limit, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setPage(1);
    setSearch(searchInput.trim());
  }

  function changeLimit(value: string | null) {
    if (!value) return;
    setLoading(true);
    setError(null);
    setLimit(value);
    setPage(1);
  }

  function changePage(nextPage: number) {
    setLoading(true);
    setError(null);
    setPage(nextPage);
  }

  const pageNumbers = Array.from({ length: Math.min(meta.totalPages, 5) }, (_, index) => {
    const firstPage = Math.min(Math.max(page - 2, 1), Math.max(meta.totalPages - 4, 1));
    return firstPage + index;
  });

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog</p><h1 className="font-headline text-4xl font-bold">Products</h1><p className="mt-2 text-sm text-zinc-500">Manage products, variants, pricing, and stock.</p></div>
        <Button nativeButton={false} render={<Link href="/admin/create-product" />}><Plus /> Add product</Button>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex max-w-lg flex-1 gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search products" className="h-10 border-zinc-200 bg-white pl-9" /></div><Button type="submit" variant="outline">Search</Button></form>
        <div className="flex items-center gap-2"><span className="text-xs text-zinc-500">Rows per page</span><Select value={limit} onValueChange={changeLimit}><SelectTrigger className="w-[82px] bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
      </div>

      <div className="overflow-hidden border border-zinc-200 bg-white">
        <Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead></TableRow></TableHeader><TableBody>
          {loading && <TableRow><TableCell colSpan={4} className="h-28 text-center text-sm text-zinc-500">Loading catalog...</TableCell></TableRow>}
          {!loading && error && <TableRow><TableCell colSpan={4} className="h-28 text-center text-sm text-red-500">{error}</TableCell></TableRow>}
          {!loading && !error && products.map((product) => { const stock = (product.product_colors ?? []).reduce((sum, color) => sum + Number(color.stock ?? 0), 0); const image = product.product_images?.[0]?.image_url; return <TableRow key={product.id}><TableCell><div className="flex min-w-56 items-center gap-3"><div className="size-12 shrink-0 overflow-hidden bg-zinc-100">{image ? <img src={image} alt="" className="size-full object-cover" /> : <ShoppingBag className="m-3 size-6 text-zinc-300" />}</div><div className="min-w-0"><p className="truncate font-medium">{product.name}</p><p className="mt-1 text-xs text-zinc-500">{product.product_colors?.length ?? 0} variants</p></div></div></TableCell><TableCell className="text-zinc-500">{product.categories?.name ?? "Uncategorized"}</TableCell><TableCell className="font-medium">{money(product.price)}</TableCell><TableCell className={stock < 5 ? "text-red-500" : "text-zinc-500"}>{stock} units</TableCell></TableRow>; })}
          {!loading && !error && products.length === 0 && <TableRow><TableCell colSpan={4} className="h-28 text-center text-sm text-zinc-500">No products match your search.</TableCell></TableRow>}
        </TableBody></Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row"><p className="text-xs text-zinc-500">Showing {products.length ? (page - 1) * Number(limit) + 1 : 0}–{Math.min(page * Number(limit), meta.total)} of {meta.total} products</p><Pagination className="mx-0 w-auto"><PaginationContent><PaginationItem><PaginationPrevious href={page > 1 ? "#" : undefined} aria-disabled={page <= 1} onClick={(event) => { event.preventDefault(); if (page > 1) changePage(page - 1); }} /></PaginationItem>{pageNumbers.map((pageNumber) => <PaginationItem key={pageNumber}><PaginationLink href="#" isActive={pageNumber === page} onClick={(event) => { event.preventDefault(); changePage(pageNumber); }}>{pageNumber}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationNext href={page < meta.totalPages ? "#" : undefined} aria-disabled={page >= meta.totalPages} onClick={(event) => { event.preventDefault(); if (page < meta.totalPages) changePage(page + 1); }} /></PaginationItem></PaginationContent></Pagination></div>
      <Link href="/admin/create-product" className="inline-flex items-center gap-2 text-sm font-medium text-tertiary">Create a new product <ArrowUpRight className="size-4" /></Link>
    </div>
  );
}
