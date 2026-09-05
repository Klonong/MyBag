"use client";

import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface DataTableSearchInputProps<TData> {
  table: Table<TData>;
  columnId: string;
  placeholder?: string;
  className?: string;
}

/**
 * Filters a single column client-side, the same way shadcn's data-table docs wire
 * up search: https://ui.shadcn.com/docs/components/base/data-table
 * The input's value IS the column's filter value — no separate React state.
 */
export function DataTableSearchInput<TData>({
  table,
  columnId,
  placeholder = "Search...",
  className,
}: DataTableSearchInputProps<TData>) {
  "use no memo";
  const column = table.getColumn(columnId);

  return (
    <div className={className ?? "relative max-w-xs flex-1"}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
      <Input
        value={(column?.getFilterValue() as string) ?? ""}
        onChange={(event) => column?.setFilterValue(event.target.value)}
        placeholder={placeholder}
        className="h-8 border-zinc-200 bg-white pl-9 text-sm"
      />
    </div>
  );
}
