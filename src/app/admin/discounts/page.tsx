"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { Percent, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableFacetedFilter,
  DataTableSearchInput,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { adminService, type AdminDiscount } from "@/services/admin.service";
import { createDiscountColumns } from "@/app/admin/discounts/columns";
import { useAsyncData } from "@/hooks/useAsyncData";

export default function AdminDiscountsPage() {
  const {
    data: discounts,
    setData: setDiscounts,
    loading,
    error,
    setError,
  } = useAsyncData(() => adminService.listDiscounts(), [], {
    initial: [] as AdminDiscount[],
    select: (result) => result.data ?? [],
  });

  const deleteDiscount = useCallback(
    async (discount: AdminDiscount) => {
      if (!window.confirm(`Delete "${discount.name}"?`)) return;
      const result = await adminService.deleteDiscount(discount.id);
      if (result.error) setError(result.error.message);
      else setDiscounts((current) => current.filter((item) => item.id !== discount.id));
    },
    [setDiscounts, setError],
  );

  const columns = useMemo(() => createDiscountColumns({ onDelete: deleteDiscount }), [deleteDiscount]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary">
            <Percent className="size-5" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Pricing</p>
          <h1 className="font-headline text-4xl font-bold">Discounts</h1>
          <p className="mt-2 text-sm text-zinc-500">Manage promotions connected to the admin API.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/discounts/new" />}>
          <Plus /> New discount
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <DataTable
        columns={columns}
        data={discounts}
        isLoading={loading}
        getRowId={(discount) => discount.id}
        pageSize={10}
        emptyState="No discounts match your filters."
        toolbar={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          return (
            <DataTableToolbar
              table={table}
              isFiltered={isFiltered}
              onResetFilters={() => table.resetColumnFilters()}
            >
              <DataTableSearchInput table={table} columnId="name" placeholder="Search campaigns" />
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Scheduled", value: "Scheduled" },
                  { label: "Expired", value: "Expired" },
                ]}
              />
            </DataTableToolbar>
          );
        }}
      />
    </div>
  );
}
