import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, UserCheck } from "lucide-react";
import { LeaderboardFiltersProps } from "./types";

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  filters,
  onFiltersChange,
  className
}) => {
  const handlePeriodChange = (period: string) => {
    onFiltersChange({ ...filters, period: period as any });
  };

  const handleLevelChange = (level: string) => {
    onFiltersChange({ ...filters, level: level as any });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status as any });
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 admin-text-tertiary" />
            <select
              value={filters.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-3 py-2 rounded-md admin-input text-sm"
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 admin-text-tertiary" />
            <select
              value={filters.level}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="px-3 py-2 rounded-md admin-input text-sm"
            >
              <option value="all">All Levels</option>
              <option value="diamond">Diamond</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 admin-text-tertiary" />
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 rounded-md admin-input text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
