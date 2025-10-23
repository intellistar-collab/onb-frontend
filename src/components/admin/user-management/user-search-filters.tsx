"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  MapPin,
  Tag
} from "lucide-react";

interface UserSearchFiltersProps {
  onSearch: (filters: UserFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
}

interface UserFilters {
  searchTerm: string;
  status: string;
  role: string;
  minSpend: string;
  maxSpend: string;
  dateRange: string;
  referralSource: string;
  affiliateCode: string;
  sortBy: string;
  sortOrder: string;
}

export const UserSearchFilters: React.FC<UserSearchFiltersProps> = ({
  onSearch,
  onClear,
  isLoading = false,
}) => {
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: "",
    status: "ALL",
    role: "ALL",
    minSpend: "",
    maxSpend: "",
    dateRange: "ALL",
    referralSource: "",
    affiliateCode: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      searchTerm: "",
      status: "ALL",
      role: "ALL",
      minSpend: "",
      maxSpend: "",
      dateRange: "ALL",
      referralSource: "",
      affiliateCode: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    onClear();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== "ALL") count++;
    if (filters.role !== "ALL") count++;
    if (filters.minSpend || filters.maxSpend) count++;
    if (filters.dateRange !== "ALL") count++;
    if (filters.referralSource) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Basic Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by username, email, or name..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value: string) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                  <SelectItem value="FLAGGED">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Filter */}
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={filters.role} onValueChange={(value: string) => handleFilterChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value: string) => handleFilterChange("dateRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Time</SelectItem>
                  <SelectItem value="TODAY">Today</SelectItem>
                  <SelectItem value="WEEK">This Week</SelectItem>
                  <SelectItem value="MONTH">This Month</SelectItem>
                  <SelectItem value="QUARTER">This Quarter</SelectItem>
                  <SelectItem value="YEAR">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Spend Range */}
            <div>
              <Label htmlFor="minSpend">Min Spend</Label>
              <Input
                id="minSpend"
                type="number"
                placeholder="0.00"
                value={filters.minSpend}
                onChange={(e) => handleFilterChange("minSpend", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxSpend">Max Spend</Label>
              <Input
                id="maxSpend"
                type="number"
                placeholder="1000.00"
                value={filters.maxSpend}
                onChange={(e) => handleFilterChange("maxSpend", e.target.value)}
              />
            </div>

            {/* Referral Source */}
            <div>
              <Label htmlFor="referralSource">Referral Source</Label>
              <Input
                id="referralSource"
                placeholder="e.g., Instagram, Facebook, Google"
                value={filters.referralSource}
                onChange={(e) => handleFilterChange("referralSource", e.target.value)}
              />
            </div>

            {/* Affiliate Code */}
            <div>
              <Label htmlFor="affiliateCode">Affiliate Code</Label>
              <Input
                id="affiliateCode"
                placeholder="e.g., AFF123, PROMO50"
                value={filters.affiliateCode}
                onChange={(e) => handleFilterChange("affiliateCode", e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value: string) => handleFilterChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Registration Date</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="totalSpend">Total Spend</SelectItem>
                  <SelectItem value="lastLogin">Last Login</SelectItem>
                  <SelectItem value="walletBalance">Wallet Balance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Select value={filters.sortOrder} onValueChange={(value: string) => handleFilterChange("sortOrder", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSearch} disabled={isLoading} className="flex-1">
              {isLoading ? "Searching..." : "Apply Filters"}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm admin-text-secondary">Active filters:</span>
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("searchTerm", "")}
              />
            </Badge>
          )}
          {filters.status !== "ALL" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("status", "ALL")}
              />
            </Badge>
          )}
          {filters.role !== "ALL" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Role: {filters.role}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("role", "ALL")}
              />
            </Badge>
          )}
          {(filters.minSpend || filters.maxSpend) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Spend: {filters.minSpend || "0"} - {filters.maxSpend || "∞"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange("minSpend", "");
                  handleFilterChange("maxSpend", "");
                }}
              />
            </Badge>
          )}
          {filters.referralSource && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Source: {filters.referralSource}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("referralSource", "")}
              />
            </Badge>
          )}
          {filters.affiliateCode && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Affiliate: {filters.affiliateCode}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("affiliateCode", "")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
