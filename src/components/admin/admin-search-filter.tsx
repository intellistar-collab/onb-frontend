"use client";

import React, { useState, useRef, useEffect } from "react";
import { AdminCard } from "./admin-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown } from "lucide-react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get status color configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          dotColor: "bg-yellow-500",
          textColor: "text-yellow-700 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
        };
      case "ACTIVE":
        return {
          dotColor: "bg-green-500",
          textColor: "text-green-700 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
        };
      case "DISABLED":
        return {
          dotColor: "bg-red-500",
          textColor: "text-red-700 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          dotColor: "bg-gray-500",
          textColor: "text-gray-700 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  const selectedOption = filterOptions.find(option => option.value === filterValue);
  const selectedConfig = selectedOption ? getStatusConfig(selectedOption.value) : null;

  return (
    <AdminCard className={cn("mb-6", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 admin-text-tertiary h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md admin-input"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {filterOptions.length > 0 && onFilterChange && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md admin-input min-w-[140px]"
              >
                <div className="flex items-center gap-2">
                  {selectedConfig && (
                    <div className={`w-2 h-2 rounded-full ${selectedConfig.dotColor}`}></div>
                  )}
                  <span className="text-sm">
                    {selectedOption ? selectedOption.label : "All"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 admin-bg-secondary admin-border-primary border rounded-md admin-shadow">
                  <div className="py-1">
                    {filterOptions.map((option) => {
                      const config = getStatusConfig(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            onFilterChange(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm admin-hover-bg flex items-center gap-2"
                        >
                          <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
                          <span className={config.textColor}>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
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
