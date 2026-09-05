"use client";

import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface FacetedOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  options: FacetedOption[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  "use no memo";
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set((column?.getFilterValue() as string[]) ?? []);

  function toggle(value: string) {
    const next = new Set(selectedValues);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    const values = Array.from(next);
    column?.setFilterValue(values.length ? values : undefined);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="border-dashed bg-white" />}
      >
        <PlusCircle />
        {title}
        {selectedValues.size > 0 && (
          <>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
              {selectedValues.size}
            </Badge>
            <div className="hidden gap-1 lg:flex">
              {selectedValues.size > 2 ? (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selectedValues.size} selected
                </Badge>
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => toggle(option.value)}
                closeOnClick={false}
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-[4px] border border-zinc-300",
                    isSelected && "border-zinc-900 bg-zinc-900 text-white",
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                </span>
                {option.icon && <option.icon className="text-zinc-400" />}
                <span className="flex-1">{option.label}</span>
                {facets?.get(option.value) !== undefined && (
                  <span className="font-mono text-xs text-zinc-400">
                    {facets.get(option.value)}
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
          {selectedValues.size > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => column?.setFilterValue(undefined)}
                className="justify-center text-center"
              >
                Clear filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
