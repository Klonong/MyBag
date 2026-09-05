"use client";

import { useEffect, useState, type FormEvent } from "react";
import { productsService } from "@/services/products.service";
import type { ProductDetail, ProductListMeta } from "@/interfaces";
import { adminProducts } from "@/data/admin-mock";

export const emptyAdminProductsMeta: ProductListMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

export const money = (value: string | number | null | undefined) =>
  `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

export const useAdminProducts = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [meta, setMeta] = useState<ProductListMeta>(emptyAdminProductsMeta);
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
  }

  return {
    products,
    meta,
    searchInput,
    setSearchInput,
    page,
    limit,
    loading,
    error,
    handleSearch,
    changeLimit,
    changePage,
    pageNumbers,
    deletingId,
    removeProduct,
  };
};
