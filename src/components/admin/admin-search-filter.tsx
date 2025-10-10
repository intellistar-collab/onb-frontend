"use client";

import React from "react";
import { AdminCard } from "./admin-card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface AdminSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  onMoreFilters?: () => void;
  className?: string;
}

export const AdminSearchFilter: React.FC<AdminSearchFilterProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = "Filter",
  onMoreFilters,
  className,
}) => {
  return (
    <AdminCard className={cn("mb-6", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="admin-input pl-10 pr-4 py-2"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {filterOptions.length > 0 && onFilterChange && (
            <select
              value={filterValue || ""}
              onChange={(e) => onFilterChange(e.target.value)}
              className="admin-input px-3 py-2"
            >
              <option value="">All {filterLabel}s</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {onMoreFilters && (
            <Button
              variant="outline"
              onClick={onMoreFilters}
              className="admin-button-secondary"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          )}
        </div>
      </div>
    </AdminCard>
  );
};
