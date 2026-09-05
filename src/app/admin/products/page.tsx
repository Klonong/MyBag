"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableFacetedFilter,
  DataTableSearchInput,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { createProductColumns } from "@/app/admin/products/columns";
import type { ProductDetail } from "@/interfaces";

export default function AdminProductsPage() {
  const { products, loading, error, deletingId, removeProduct, removeProducts } = useAdminProducts();

  const columns = useMemo(
    () =>
      createProductColumns({
        deletingId,
        onDelete: (product) => {
          if (window.confirm(`Delete "${product.name}"?`)) void removeProduct(product.id);
        },
      }),
    [deletingId, removeProduct],
  );

  const categoryOptions = useMemo(() => {
    const names = new Set(products.map((product) => product.categories?.name ?? "Uncategorized"));
    return Array.from(names).map((name) => ({ label: name, value: name }));
  }, [products]);

  const badgeOptions = useMemo(() => {
    const names = new Set(products.map((product) => product.badges?.name ?? "None"));
    return Array.from(names).map((name) => ({ label: name, value: name }));
  }, [products]);

  const stockOptions = [
    { label: "In stock", value: "In stock" },
    { label: "Low stock", value: "Low stock" },
    { label: "Out of stock", value: "Out of stock" },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog</p>
          <h1 className="font-headline text-4xl font-bold">Products</h1>
          <p className="mt-2 text-sm text-zinc-500">Manage products, variants, pricing, and stock.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/create-product" />}>
          <Plus /> Add product
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
        getRowId={(product: ProductDetail) => product.id}
        pageSize={10}
        initialColumnVisibility={{ stockStatus: false }}
        emptyState="No products match your filters."
        toolbar={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          const selectedRows = table.getFilteredSelectedRowModel().rows;
          return (
            <div className="space-y-3">
              <DataTableToolbar
                table={table}
                isFiltered={isFiltered}
                onResetFilters={() => table.resetColumnFilters()}
                action={
                  selectedRows.length > 0 ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${selectedRows.length} selected product(s)?`,
                          )
                        ) {
                          void removeProducts(selectedRows.map((row) => row.original.id)).then(
                            () => table.resetRowSelection(),
                          );
                        }
                      }}
                    >
                      <Trash2 />
                      Delete {selectedRows.length} selected
                    </Button>
                  ) : undefined
                }
              >
                <DataTableSearchInput table={table} columnId="name" placeholder="Search products" />
                <DataTableFacetedFilter
                  column={table.getColumn("category")}
                  title="Category"
                  options={categoryOptions}
                />
                <DataTableFacetedFilter
                  column={table.getColumn("badge")}
                  title="Badge"
                  options={badgeOptions}
                />
                <DataTableFacetedFilter
                  column={table.getColumn("stockStatus")}
                  title="Stock"
                  options={stockOptions}
                />
              </DataTableToolbar>
            </div>
          );
        }}
      />
    </div>
  );
}
