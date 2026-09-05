"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, ShoppingBag, Trash2 } from "lucide-react";

import type { ProductDetail } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { money, productStock } from "@/hooks/useAdminProducts";

export function stockStatus(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock < 5) return "Low stock";
  return "In stock";
}

export function createProductColumns(options: {
  onDelete: (product: ProductDetail) => void;
  deletingId: string | null;
}): ColumnDef<ProductDetail>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorFn: (product) => product.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
      meta: { label: "Product" },
      cell: ({ row }) => {
        const product = row.original;
        const image = product.product_images?.[0]?.image_url;
        return (
          <div className="flex min-w-56 items-center gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="size-full object-cover" />
              ) : (
                <ShoppingBag className="m-3 size-6 text-zinc-300" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{product.name}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {product.product_colors?.length ?? 0} variants
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      accessorFn: (product) => product.categories?.name ?? "Uncategorized",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      meta: { label: "Category" },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => <span className="text-zinc-500">{getValue<string>()}</span>,
    },
    {
      id: "badge",
      accessorFn: (product) => product.badges?.name ?? "None",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Badge" />,
      meta: { label: "Badge" },
      filterFn: "arrIncludesSome",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value === "None" ? (
          <span className="text-zinc-300">—</span>
        ) : (
          <Badge variant="outline">{value}</Badge>
        );
      },
    },
    {
      id: "price",
      accessorFn: (product) => Number(product.price ?? 0),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      meta: { label: "Price" },
      cell: ({ getValue }) => <span className="font-medium">{money(getValue<number>())}</span>,
    },
    {
      id: "stock",
      accessorFn: (product) => productStock(product),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      meta: { label: "Stock" },
      cell: ({ getValue }) => {
        const stock = getValue<number>();
        const status = stockStatus(stock);
        return (
          <Badge
            variant={status === "Out of stock" ? "destructive" : "outline"}
            className={status === "Low stock" ? "border-amber-300 text-amber-700" : undefined}
          >
            {stock} units
          </Badge>
        );
      },
    },
    {
      id: "stockStatus",
      accessorFn: (product) => stockStatus(productStock(product)),
      header: "Stock status",
      meta: { label: "Stock status" },
      filterFn: "arrIncludesSome",
      enableSorting: false,
    },
    {
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${product.name}`} />}
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  render={<Link href={`/admin/products/${product.id}/edit`} />}
                >
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={options.deletingId === product.id}
                  onClick={() => options.onDelete(product)}
                >
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
