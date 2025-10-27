"use client";

import React from "react";
import { SimpleTableProps } from "./types";
import { BaseTable } from "./base-table";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Simple table with basic search functionality
export function SimpleTable<T = any>({
  data,
  columns,
  actions,
  className,
  loading = false,
  emptyMessage = "No data available",
  emptyIcon,
  rowKey,
  rowClassName,
  onRowClick,
  onRowDoubleClick,
  hoverable = true,
  striped = false,
  bordered = false,
  size = "md",
  stickyHeader = false,
  stickyActions = false,
  title,
  description,
  searchable = true,
  searchPlaceholder = "Search...",
}: SimpleTableProps<T>) {
  return (
    <div className={cn("admin-card", className)}>
      {/* Header with search */}
      {(title || description || searchable) && (
        <div className="px-4 py-4 border-b admin-border-primary">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and description */}
            {(title || description) && (
              <div>
                {title && (
                  <h3 className="text-lg font-semibold admin-text-primary">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm admin-text-tertiary mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Search */}
            {searchable && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="pl-10"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <BaseTable
        data={data}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage={emptyMessage}
        emptyIcon={emptyIcon}
        rowKey={rowKey}
        rowClassName={rowClassName}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        hoverable={hoverable}
        striped={striped}
        bordered={bordered}
        size={size}
        stickyHeader={stickyHeader}
        stickyActions={stickyActions}
      />
    </div>
  );
}
