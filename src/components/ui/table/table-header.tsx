"use client";

import React from "react";
import { TableHeaderProps } from "./types";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export function TableHeader<T = any>({
  columns,
  actions,
  sortable,
  sort,
  onSort,
  sticky,
}: TableHeaderProps<T>) {
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    if (sort?.key === key) {
      // Toggle direction if same column
      const newDirection = sort.direction === "asc" ? "desc" : "asc";
      onSort(key);
    } else {
      // Set new column with ascending direction
      onSort(key);
    }
  };

  const getSortIcon = (key: string) => {
    if (!sortable) return null;
    
    if (sort?.key === key) {
      return sort.direction === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    
    return <ChevronsUpDown className="h-4 w-4 opacity-50" />;
  };

  return (
    <thead className="admin-bg-secondary">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={cn(
              "px-4 py-3 text-left text-xs font-medium admin-text-tertiary uppercase tracking-wider",
              {
                "cursor-pointer hover:admin-hover-bg": sortable && column.sortable !== false,
                "sticky top-0 z-20": sticky,
              },
              column.className
            )}
            style={{
              width: column.width,
              ...(column.sticky === "left" && { position: "sticky", left: 0, zIndex: 20 }),
              ...(column.sticky === "right" && { position: "sticky", right: 0, zIndex: 20 }),
            }}
            onClick={() => column.sortable !== false && handleSort(column.key)}
          >
            <div className="flex items-center gap-2">
              <span>{column.label}</span>
              {sortable && column.sortable !== false && (
                <span className="flex-shrink-0">
                  {getSortIcon(column.key)}
                </span>
              )}
            </div>
          </th>
        ))}
        {actions && actions.length > 0 && (
          <th
            className={cn(
              "px-4 py-3 text-left text-xs font-medium admin-text-tertiary uppercase tracking-wider w-32",
              {
                "sticky top-0 z-20": sticky,
                "sticky right-0 z-20": sticky,
              }
            )}
          >
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}
