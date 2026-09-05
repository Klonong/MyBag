"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { Badge as AdminBadge } from "@/services/badges.service";

export function createBadgeColumns(options: {
  onDelete: (badge: AdminBadge) => void;
}): ColumnDef<AdminBadge>[] {
  return [
    {
      id: "name",
      accessorFn: (badge) => badge.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Badge" />,
      meta: { label: "Badge" },
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: "products",
      accessorFn: (badge) => Number(badge.productCount ?? 0),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
      meta: { label: "Products" },
      cell: ({ getValue }) => <span className="text-zinc-500">{getValue<number>()}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const badge = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${badge.name}`} />}
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/admin/badges/${badge.id}/edit`} />}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => options.onDelete(badge)}>
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
