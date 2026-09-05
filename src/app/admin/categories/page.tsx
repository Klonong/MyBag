"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { FolderTree, Plus } from "lucide-react";
import { Form } from "@base-ui/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, DataTableSearchInput, DataTableToolbar } from "@/components/ui/data-table";
import { adminService, type AdminCategory } from "@/services/admin.service";
import { createCategoryColumns } from "@/app/admin/categories/columns";
import { useAsyncData } from "@/hooks/useAsyncData";

export default function AdminCategoriesPage() {
  const {
    data: categories,
    setData: setCategories,
    loading,
    error,
    setError,
  } = useAsyncData(() => adminService.listCategories(), [], {
    initial: [] as AdminCategory[],
    select: (result) => result.data ?? [],
  });
  const [name, setName] = useState("");

  async function addCategory() {
    if (!name.trim()) return;
    const result = await adminService.createCategory(name.trim());
    if (result.error || !result.data) {
      setError(result.error?.message ?? "Unable to create category.");
      return;
    }
    setCategories((current) => [...current, result.data as AdminCategory]);
    setName("");
  }

  const deleteCategory = useCallback(
    async (category: AdminCategory) => {
      if (!window.confirm(`Delete "${category.name}"?`)) return;
      const result = await adminService.deleteCategory(category.id);
      if (result.error) setError(result.error.message);
      else setCategories((current) => current.filter((item) => item.id !== category.id));
    },
    [setCategories, setError],
  );

  const columns = useMemo(() => createCategoryColumns({ onDelete: deleteCategory }), [deleteCategory]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary">
            <FolderTree className="size-5" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog structure</p>
          <h1 className="font-headline text-4xl font-bold">Categories</h1>
          <p className="mt-2 text-sm text-zinc-500">Organize your collection so customers can browse it naturally.</p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/categories/new" />}>
          Create page
        </Button>
      </div>

      <Form onFormSubmit={addCategory} className="flex max-w-lg gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New category name"
          aria-label="New category name"
        />
        <Button type="submit">
          <Plus /> Add category
        </Button>
      </Form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <DataTable
        columns={columns}
        data={categories}
        isLoading={loading}
        getRowId={(category) => String(category.id)}
        pageSize={10}
        emptyState="No categories match your search."
        toolbar={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          return (
            <DataTableToolbar
              table={table}
              isFiltered={isFiltered}
              onResetFilters={() => table.resetColumnFilters()}
            >
              <DataTableSearchInput table={table} columnId="name" placeholder="Search categories" />
            </DataTableToolbar>
          );
        }}
      />
    </div>
  );
}
