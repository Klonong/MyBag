"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { AdminDiscount } from "@/services/admin.service";

function normalizedStatus(status: AdminDiscount["status"]) {
  const value = status.toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const statusStyles: Record<string, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  Expired: "border-zinc-200 bg-zinc-50 text-zinc-500",
};

export function createDiscountColumns(options: {
  onDelete: (discount: AdminDiscount) => void;
}): ColumnDef<AdminDiscount>[] {
  return [
    {
      id: "name",
      accessorFn: (discount) => discount.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Campaign" />,
      meta: { label: "Campaign" },
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: "code",
      accessorFn: (discount) => discount.code,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      meta: { label: "Code" },
      cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string>()}</span>,
    },
    {
      id: "offer",
      accessorFn: (discount) => Number(String(discount.value).replace(/[^0-9.]/g, "")) || 0,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Offer" />,
      meta: { label: "Offer" },
      cell: ({ row }) => {
        const discount = row.original;
        const isPercentage = discount.type === "percentage" || discount.type === "Percentage";
        return isPercentage
          ? `${discount.value}%`
          : `Rp ${Number(discount.value).toLocaleString("id-ID")}`;
      },
    },
    {
      id: "status",
      accessorFn: (discount) => normalizedStatus(discount.status),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      meta: { label: "Status" },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <Badge variant="outline" className={statusStyles[value]}>
            {value}
          </Badge>
        );
      },
    },
    {
      id: "ends",
      accessorFn: (discount) => discount.endsAt ?? discount.ends ?? "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ends" />,
      meta: { label: "Ends" },
      cell: ({ getValue }) => <span className="text-zinc-500">{getValue<string>() || "-"}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const discount = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${discount.name}`} />}
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/admin/discounts/${discount.id}/edit`} />}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => options.onDelete(discount)}>
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
