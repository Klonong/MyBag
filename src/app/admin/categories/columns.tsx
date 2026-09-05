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
import type { AdminCategory } from "@/services/admin.service";

export function createCategoryColumns(options: {
  onDelete: (category: AdminCategory) => void;
}): ColumnDef<AdminCategory>[] {
  return [
    {
      id: "name",
      accessorFn: (category) => category.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      meta: { label: "Category" },
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: "products",
      accessorFn: (category) => Number(category.productCount ?? category.products ?? 0),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Products" />,
      meta: { label: "Products" },
      cell: ({ getValue }) => <span className="text-zinc-500">{getValue<number>()}</span>,
    },
    {
      id: "updated",
      accessorFn: (category) => category.updatedAt ?? category.updated ?? "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last updated" />,
      meta: { label: "Last updated" },
      cell: ({ getValue }) => <span className="text-zinc-500">{getValue<string>() || "-"}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${category.name}`} />}
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={`/admin/categories/${category.id}/edit`} />}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => options.onDelete(category)}>
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
