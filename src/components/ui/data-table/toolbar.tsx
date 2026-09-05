"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table/view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  children?: React.ReactNode;
  action?: React.ReactNode;
  hideViewOptions?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  isFiltered,
  onResetFilters,
  children,
  action,
  hideViewOptions,
}: DataTableToolbarProps<TData>) {
  "use no memo";
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {children}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-zinc-500">
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!hideViewOptions && <DataTableViewOptions table={table} />}
        {action}
      </div>
    </div>
  );
}
