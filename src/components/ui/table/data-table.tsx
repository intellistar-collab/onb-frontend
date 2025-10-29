"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DataTableProps } from "./types";
import { TableProvider, useTable } from "./table-context";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";
import { TableFooter } from "./table-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  filterData, 
  sortData, 
  paginateData, 
  getVisibleColumns, 
  getTableClasses,
  exportToCSV 
} from "./utils";
import { cn } from "@/lib/utils";
import { AdminInlineLoading } from "@/components/admin/admin-loading";
import { 
  Search, 
  RefreshCw, 
  Download, 
  Filter,
  X,
  CheckSquare,
  Square
} from "lucide-react";

// Table toolbar component
function TableToolbar<T = any>({
  title,
  description,
  searchable,
  searchPlaceholder,
  filters,
  refreshable,
  onRefresh,
  refreshLoading,
  statusFilter,
  exportable,
  onExport,
  exportFormats = ["csv"],
  selectedCount,
  onClearSelection,
}: {
  title?: string;
  description?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: any[];
  refreshable?: boolean;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  statusFilter?: any;
  exportable?: boolean;
  onExport?: (data: T[]) => void;
  exportFormats?: string[];
  selectedCount?: number;
  onClearSelection?: () => void;
}) {
  const { state, updateState } = useTable<T>();

  const handleSearchChange = (value: string) => {
    updateState({ searchTerm: value, currentPage: 1 });
  };

  const handleFilterChange = (key: string, value: any) => {
    updateState({ 
      filters: { ...state.filters, [key]: value }, 
      currentPage: 1 
    });
  };

  const handleExport = () => {
    if (onExport) {
      onExport([]); // This would need to be passed the actual data
    }
  };

  return (
    <div className="px-4 py-4 border-b admin-border-primary">
      <div className="flex flex-col gap-4">
        {/* Header */}
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

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {searchable && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={state.searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {statusFilter && (
              <div className="w-full sm:w-40">
                <Select
                  value={statusFilter.value}
                  onValueChange={statusFilter.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilter.options.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filters && filters.length > 0 && (
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <div key={filter.key} className="w-32">
                    {filter.type === "select" ? (
                      <Select
                        value={filter.value || ""}
                        onValueChange={(value) => handleFilterChange(filter.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={filter.type}
                        placeholder={filter.placeholder}
                        value={filter.value || ""}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {selectedCount && selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm admin-text-tertiary">
                  {selectedCount} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}

            {refreshable && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshLoading}
                className="h-8 px-3"
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", refreshLoading && "animate-spin")} />
                Refresh
              </Button>
            )}

            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-8 px-3"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Table body component
function TableBody<T = any>({
  loading,
  emptyMessage,
  emptyIcon,
  hoverable,
  striped,
  onRowClick,
  onRowDoubleClick,
  sortable,
  onSort,
}: {
  loading: boolean;
  emptyMessage: string;
  emptyIcon?: React.ReactNode;
  hoverable: boolean;
  striped: boolean;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  sortable: boolean;
  onSort: (key: string) => void;
}) {
  const { data, columns, actions, state, getRowKey, isSelected } = useTable<T>();

  // Process data
  const filteredData = filterData(data, state.searchTerm, columns, undefined);
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

// Main DataTable component
export function DataTable<T = any>({
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
  searchKeys,
  filters,
  sortable = true,
  defaultSort,
  onSort,
  pagination,
  onPageChange,
  selection,
  exportable = false,
  onExport,
  exportFormats = ["csv"],
  refreshable = false,
  onRefresh,
  refreshLoading = false,
  statusFilter,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(defaultSort || null);

  const handleSort = useCallback((key: string) => {
    const newSort = sort?.key === key 
      ? { key, direction: (sort.direction === "asc" ? "desc" : "asc") as "asc" | "desc" }
      : { key, direction: "asc" as const };
    
    setSort(newSort);
    if (onSort) {
      onSort(newSort);
    }
  }, [sort, onSort]);

  const visibleColumns = getVisibleColumns(columns);
  const tableClasses = getTableClasses({ size, striped, bordered, hoverable });

  return (
    <TableProvider
      data={data}
      columns={columns}
      actions={actions}
      rowKey={rowKey}
      onSelectionChange={selection?.onChange}
    >
      <div className={cn("admin-card", className)}>
        {/* Toolbar */}
        <TableToolbar
          title={title}
          description={description}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          refreshable={refreshable}
          onRefresh={onRefresh}
          refreshLoading={refreshLoading}
          statusFilter={statusFilter}
          exportable={exportable}
          onExport={onExport}
          exportFormats={exportFormats}
          selectedCount={selection?.selectedRowKeys.length}
          onClearSelection={selection?.onChange ? () => selection.onChange([], []) : undefined}
        />

        {/* Table */}
        <div className="overflow-x-auto admin-table-scroll">
          <table className={tableClasses}>
            <TableHeader
              columns={visibleColumns}
              actions={actions}
              sortable={sortable}
              sort={sort}
              onSort={handleSort}
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
              sortable={sortable}
              onSort={handleSort}
            />
          </table>
        </div>

        {/* Footer */}
        {pagination && (
          <TableFooter
            pagination={pagination}
            onPageChange={onPageChange}
            selectedCount={selection?.selectedRowKeys.length}
            onClearSelection={selection?.onChange ? () => selection.onChange([], []) : undefined}
          />
        )}
      </div>
    </TableProvider>
  );
}
