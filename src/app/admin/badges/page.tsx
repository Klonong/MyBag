"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Plus } from "lucide-react";
import { Form } from "@base-ui/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, DataTableSearchInput, DataTableToolbar } from "@/components/ui/data-table";
import { badgesService, type Badge } from "@/services/badges.service";
import { createBadgeColumns } from "@/app/admin/badges/columns";
import { useAsyncData } from "@/hooks/useAsyncData";

export default function AdminBadgesPage() {
  const {
    data: badges,
    setData: setBadges,
    loading,
    error,
    setError,
  } = useAsyncData(() => badgesService.list(), [], {
    initial: [] as Badge[],
    select: (result) => result.data ?? [],
  });
  const [name, setName] = useState("");

  async function addBadge() {
    if (!name.trim()) return;
    const result = await badgesService.create(name.trim());
    if (result.error || !result.data) {
      setError(result.error?.message ?? "Unable to create badge.");
      return;
    }
    setBadges((current) => [...current, result.data as Badge]);
    setName("");
  }

  const deleteBadge = useCallback(
    async (badge: Badge) => {
      if (!window.confirm(`Delete "${badge.name}"?`)) return;
      const result = await badgesService.remove(badge.id);
      if (result.error) setError(result.error.message);
      else setBadges((current) => current.filter((item) => item.id !== badge.id));
    },
    [setBadges, setError],
  );

  const columns = useMemo(() => createBadgeColumns({ onDelete: deleteBadge }), [deleteBadge]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary">
            <BadgeCheck className="size-5" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog structure</p>
          <h1 className="font-headline text-4xl font-bold">Badges</h1>
          <p className="mt-2 text-sm text-zinc-500">Highlight products with labels like Bestseller or Limited.</p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/badges/new" />}>
          Create page
        </Button>
      </div>

      <Form onFormSubmit={addBadge} className="flex max-w-lg gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New badge name"
          aria-label="New badge name"
        />
        <Button type="submit">
          <Plus /> Add badge
        </Button>
      </Form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <DataTable
        columns={columns}
        data={badges}
        isLoading={loading}
        getRowId={(badge) => String(badge.id)}
        pageSize={10}
        emptyState="No badges match your search."
        toolbar={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          return (
            <DataTableToolbar
              table={table}
              isFiltered={isFiltered}
              onResetFilters={() => table.resetColumnFilters()}
            >
              <DataTableSearchInput table={table} columnId="name" placeholder="Search badges" />
            </DataTableToolbar>
          );
        }}
      />
    </div>
  );
}
