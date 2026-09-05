"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserCog } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { numericMoney } from "@/hooks/useAdminDashboard";
import type { AdminCustomer } from "@/services/admin.service";

function initials(name: string | null | undefined, email: string) {
  const source = name?.trim() || email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isActive(customer: AdminCustomer) {
  return !(customer.isActive === false || customer.status === "Inactive");
}

export const customerColumns: ColumnDef<AdminCustomer>[] = [
  {
    id: "customer",
    accessorFn: (customer) => `${customer.name ?? ""} ${customer.email}`.trim(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    meta: { label: "Customer" },
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials(customer.name, customer.email)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{customer.name ?? "Unnamed customer"}</p>
            <p className="mt-0.5 truncate text-xs text-zinc-500">{customer.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "orders",
    accessorFn: (customer) => Number(customer.orderCount ?? customer.orders ?? 0),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Orders" />,
    meta: { label: "Orders" },
  },
  {
    id: "spent",
    accessorFn: (customer) => numericMoney(customer.totalSpent ?? customer.spent),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total spent" />,
    meta: { label: "Total spent" },
    cell: ({ row }) => (
      <span className="font-medium">{row.original.totalSpent ?? row.original.spent ?? "-"}</span>
    ),
  },
  {
    id: "status",
    accessorFn: (customer) => (isActive(customer) ? "Active" : "Inactive"),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    meta: { label: "Status" },
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <Badge
          variant="outline"
          className={
            value === "Active"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-zinc-200 bg-zinc-50 text-zinc-500"
          }
        >
          {value}
        </Badge>
      );
    },
  },
  {
    id: "joined",
    accessorFn: (customer) => customer.createdAt ?? customer.joined ?? "",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    meta: { label: "Joined" },
    cell: ({ getValue }) => <span className="text-zinc-500">{getValue<string>() || "-"}</span>,
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${customer.email}`} />}
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/admin/customers/${customer.id}/edit`} />}>
                <UserCog />
                Manage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
