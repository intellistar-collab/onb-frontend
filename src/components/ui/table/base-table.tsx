"use client";

import React from "react";
import { BaseTableProps } from "./types";
import { TableProvider, useTable } from "./table-context";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";
import { TableFooter } from "./table-footer";
import { 
  filterData, 
  sortData, 
  paginateData, 
  getVisibleColumns, 
  getTableClasses 
} from "./utils";
import { cn } from "@/lib/utils";
import { AdminInlineLoading } from "@/components/admin/admin-loading";

// Table body component
function TableBody<T = any>({
  loading,
  emptyMessage,
  emptyIcon,
  hoverable,
  striped,
  onRowClick,
  onRowDoubleClick,
}: {
  loading: boolean;
  emptyMessage: string;
  emptyIcon?: React.ReactNode;
  hoverable: boolean;
  striped: boolean;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
}) {
  const { data, columns, actions, state, getRowKey, isSelected } = useTable<T>();

  // Process data
  const filteredData = filterData(data, state.searchTerm, columns);
  const sortedData = sortData(filteredData, state.sort, columns);
  const paginatedData = paginateData(sortedData, state.currentPage, state.pageSize);

  const visibleColumns = getVisibleColumns(columns);

  if (loading) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={visibleColumns.length + (actions ? 1 : 0)}
            className="text-center py-12"
          >
            <AdminInlineLoading />
          </td>
        </tr>
      </tbody>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={visibleColumns.length + (actions ? 1 : 0)}
            className="text-center py-12 admin-text-tertiary"
          >
            <div className="flex flex-col items-center gap-2">
              {emptyIcon || (
                <div className="w-12 h-12 rounded-full admin-bg-tertiary flex items-center justify-center">
                  <svg className="w-6 h-6 admin-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              )}
              <span className="text-sm font-medium">
                {state.searchTerm ? "No results found" : emptyMessage}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y admin-border-primary">
      {paginatedData.map((row, index) => {
        const rowKey = getRowKey(row, index);
        const selected = isSelected(row, index);

        return (
          <TableRow
            key={rowKey}
            row={row}
            index={index}
            columns={visibleColumns}
            actions={actions}
            rowKey={rowKey}
            selected={selected}
            hoverable={hoverable}
            striped={striped}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            onActionClick={(action, row, index) => action.onClick(row, index)}
          />
        );
      })}
    </tbody>
  );
}

// Main BaseTable component
export function BaseTable<T = any>({
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
}: BaseTableProps<T>) {
  const visibleColumns = getVisibleColumns(columns);
  const tableClasses = getTableClasses({ size, striped, bordered, hoverable });

  return (
    <TableProvider
      data={data}
      columns={columns}
      actions={actions}
      rowKey={rowKey}
    >
      <div className={cn("overflow-x-auto admin-table-scroll", className)}>
        <table className={tableClasses}>
          <TableHeader
            columns={visibleColumns}
            actions={actions}
            sortable={false}
            sort={null}
            onSort={() => {}}
            sticky={stickyHeader}
          />
          <TableBody
            loading={loading}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            hoverable={hoverable}
            striped={striped}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
          />
        </table>
      </div>
    </TableProvider>
  );
}
