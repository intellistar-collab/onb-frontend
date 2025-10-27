"use client";

import React from "react";
import { TableFooterProps } from "./types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { generatePageNumbers, getPaginationInfo } from "./utils";

export function TableFooter<T = any>({
  pagination,
  onPageChange,
  selectedCount,
  onClearSelection,
}: TableFooterProps<T>) {
  if (!pagination) return null;

  const { page, pageSize, total, showSizeChanger, pageSizeOptions, showQuickJumper, showTotal } = pagination;
  const { startItem, endItem, totalPages, hasNext, hasPrev } = getPaginationInfo(total, page, pageSize);
  
  const pageNumbers = generatePageNumbers(page, totalPages);

  const handlePageChange = (newPage: number) => {
    if (onPageChange && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    if (onPageChange) {
      onPageChange(1, parseInt(newPageSize));
    }
  };

  const handleQuickJump = (value: string) => {
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
    }
  };

  const defaultPageSizeOptions = [10, 20, 50, 100];
  const sizeOptions = pageSizeOptions || defaultPageSizeOptions;

  return (
    <div className="px-4 py-3 border-t admin-border-primary admin-bg-secondary">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left side - Selection info and total */}
        <div className="flex items-center gap-4">
          {selectedCount && selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm admin-text-tertiary">
                {selectedCount} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          )}
          
          <div className="text-sm admin-text-tertiary">
            {showTotal ? (
              showTotal(total, [startItem, endItem])
            ) : (
              `Showing ${startItem} to ${endItem} of ${total} results`
            )}
          </div>
        </div>

        {/* Right side - Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Page size changer */}
          {showSizeChanger && (
            <div className="flex items-center gap-2">
              <span className="text-sm admin-text-tertiary">Show:</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm admin-text-tertiary">per page</span>
            </div>
          )}

          {/* Quick jumper */}
          {showQuickJumper && totalPages > 10 && (
            <div className="flex items-center gap-2">
              <span className="text-sm admin-text-tertiary">Go to:</span>
              <Input
                type="number"
                min={1}
                max={totalPages}
                placeholder="Page"
                className="w-16 h-8"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleQuickJump(e.currentTarget.value);
                  }
                }}
              />
            </div>
          )}

          {/* Pagination buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* First page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={!hasPrev}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!hasPrev}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span className="px-2 py-1 text-sm admin-text-tertiary">...</span>
                    ) : (
                      <Button
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum as number)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNext}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={!hasNext}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
