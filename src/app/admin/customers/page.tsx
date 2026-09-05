"use client";

import { Users } from "lucide-react";

import {
  DataTable,
  DataTableFacetedFilter,
  DataTableSearchInput,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { adminService, type AdminCustomer } from "@/services/admin.service";
import { adminCustomers } from "@/data/admin-mock";
import { customerColumns } from "@/app/admin/customers/columns";
import { useAsyncData } from "@/hooks/useAsyncData";

export default function AdminCustomersPage() {
  const {
    data: customers,
    loading,
    error,
  } = useAsyncData(() => adminService.listCustomers({ limit: 200 }), [], {
    initial: [] as AdminCustomer[],
    select: (result): AdminCustomer[] =>
      result.data?.length ? result.data : (adminCustomers as AdminCustomer[]),
  });

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary">
          <Users className="size-5" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Relationships</p>
        <h1 className="font-headline text-4xl font-bold">Customers</h1>
        <p className="mt-2 text-sm text-zinc-500">Search, filter, and manage customers from the admin API.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <DataTable
        columns={customerColumns}
        data={customers}
        isLoading={loading}
        getRowId={(customer) => customer.id}
        pageSize={10}
        emptyState="No customers match your filters."
        toolbar={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          return (
            <DataTableToolbar
              table={table}
              isFiltered={isFiltered}
              onResetFilters={() => table.resetColumnFilters()}
            >
              <DataTableSearchInput table={table} columnId="customer" placeholder="Search customers" />
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </DataTableToolbar>
          );
        }}
      />
    </div>
  );
}
