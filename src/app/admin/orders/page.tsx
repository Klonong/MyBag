"use client";

import { useCallback, useMemo } from "react";
import { ReceiptText } from "lucide-react";

import {
  DataTable,
  DataTableFacetedFilter,
  DataTableSearchInput,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { adminService, type AdminOrder } from "@/services/admin.service";
import { adminOrders } from "@/data/admin-mock";
import { createOrderColumns, orderStatuses } from "@/app/admin/orders/columns";
import { useAsyncData } from "@/hooks/useAsyncData";

export default function AdminOrdersPage() {
  const {
    data: orders,
    setData: setOrders,
    loading,
    error,
    setError,
  } = useAsyncData(() => adminService.listOrders({ limit: 200 }), [], {
    initial: [] as AdminOrder[],
    select: (result): AdminOrder[] => (result.data?.length ? result.data : (adminOrders as AdminOrder[])),
  });

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      const result = await adminService.updateOrderStatus(id, status);
      if (result.error) {
        setError(result.error.message);
        return;
      }
      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                ...result.data,
                status,
                order_statuses: result.data?.order_statuses ?? {
                  id: order.order_statuses?.id ?? order.status_id ?? 0,
                  code: status,
                  name: status.charAt(0).toUpperCase() + status.slice(1),
                },
              }
            : order,
        ),
      );
    },
    [setError, setOrders],
  );

  const columns = useMemo(() => createOrderColumns({ onStatusChange: updateStatus }), [updateStatus]);

  const statusOptions = orderStatuses.map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: status,
  }));

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary">
          <ReceiptText className="size-5" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Fulfilment</p>
        <h1 className="font-headline text-4xl font-bold">Orders</h1>
        <p className="mt-2 text-sm text-zinc-500">Review, filter, and update orders from the admin API.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <DataTable
        columns={columns}
        data={orders}
        isLoading={loading}
        getRowId={(order) => order.id}
        pageSize={10}
        emptyState="No orders match your filters."
        toolbar={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          return (
            <DataTableToolbar
              table={table}
              isFiltered={isFiltered}
              onResetFilters={() => table.resetColumnFilters()}
            >
              <DataTableSearchInput table={table} columnId="customer" placeholder="Search by customer" />
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={statusOptions}
              />
            </DataTableToolbar>
          );
        }}
      />
    </div>
  );
}
