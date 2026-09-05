"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { numericMoney } from "@/hooks/useAdminDashboard";
import { getOrderStatus, type AdminOrder } from "@/services/admin.service";

export const orderStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

const statusStyles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-blue-200 bg-blue-50 text-blue-700",
  shipped: "border-violet-200 bg-violet-50 text-violet-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase();
  return (
    <Badge variant="outline" className={cn("capitalize", statusStyles[key])}>
      {status || "Unknown"}
    </Badge>
  );
}

export function createOrderColumns(options: {
  onStatusChange: (id: string, status: string) => void;
}): ColumnDef<AdminOrder>[] {
  return [
    {
      id: "id",
      accessorFn: (order) => order.id,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      meta: { label: "Order" },
      cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string>()}</span>,
    },
    {
      id: "customer",
      accessorFn: (order) => order.customer ?? order.user_id ?? "-",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      meta: { label: "Customer" },
    },
    {
      id: "total",
      accessorFn: (order) => numericMoney(order.total),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      meta: { label: "Total" },
      cell: ({ row }) => <span className="font-medium">{row.original.total}</span>,
    },
    {
      id: "status",
      accessorFn: (order) => getOrderStatus(order),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      meta: { label: "Status" },
      filterFn: "arrIncludesSome",
      cell: ({ row }) => {
        const order = row.original;
        const status = getOrderStatus(order);
        return (
          <Select
            value={status}
            onValueChange={(value) => {
              if (value) options.onStatusChange(order.id, value);
            }}
          >
            <SelectTrigger className="h-8 w-36 border-none bg-transparent p-0 shadow-none">
              <SelectValue>{() => <OrderStatusBadge status={status} />}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "date",
      accessorFn: (order) => order.created_at ?? order.date ?? "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      meta: { label: "Date" },
      cell: ({ getValue }) => <span className="text-zinc-500">{getValue<string>() || "-"}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${order.id}`} />}
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/admin/orders/${order.id}/edit`} />}>
                  <Eye />
                  View / edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
