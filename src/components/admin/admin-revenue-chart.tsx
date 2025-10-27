"use client";

import React from "react";
import { AdminCard } from "./admin-card";
import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface DailyMetricsData {
  date: string;
  revenue: number;
  openBoxCount: number;
  newUsersCount: number;
  formattedDate: string;
}

interface AdminRevenueChartProps {
  data: DailyMetricsData[];
  className?: string;
}

// Fallback chart component in case Recharts is not available
const FallbackChart: React.FC<{ data: DailyMetricsData[] }> = ({ data }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const maxBoxes = Math.max(...data.map(d => d.openBoxCount), 1);
  const maxUsers = Math.max(...data.map(d => d.newUsersCount), 1);
  
  return (
    <div className="h-full flex flex-col">
      {/* Chart Area */}
      <div className="flex-1 flex items-end justify-between space-x-2 p-4">
        {data.map((day, index) => {
          const revenueHeight = (day.revenue / maxRevenue) * 200;
          const boxHeight = (day.openBoxCount / maxBoxes) * 200;
          const userHeight = (day.newUsersCount / maxUsers) * 200;
          const isLast = index === data.length - 1;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center space-y-1">
              {/* Revenue bar */}
              <div
                className={cn(
                  "w-full rounded-t transition-all duration-300 hover:opacity-80",
                  isLast 
                    ? "bg-gradient-to-t from-green-500 to-green-400" 
                    : "bg-gradient-to-t from-blue-500 to-blue-400"
                )}
                style={{ height: `${Math.max(revenueHeight, 10)}px` }}
                title={`Revenue: $${day.revenue.toLocaleString()}`}
              />
              {/* Box count bar */}
              <div
                className={cn(
                  "w-full rounded-t transition-all duration-300 hover:opacity-80",
                  "bg-gradient-to-t from-purple-500 to-purple-400"
                )}
                style={{ height: `${Math.max(boxHeight, 10)}px` }}
                title={`Boxes: ${day.openBoxCount.toLocaleString()}`}
              />
              {/* User count bar */}
              <div
                className={cn(
                  "w-full rounded-t transition-all duration-300 hover:opacity-80",
                  "bg-gradient-to-t from-orange-500 to-orange-400"
                )}
                style={{ height: `${Math.max(userHeight, 10)}px` }}
                title={`Users: ${day.newUsersCount.toLocaleString()}`}
              />
            </div>
          );
        })}
      </div>
      
      {/* X-axis Labels */}
      <div className="flex justify-between text-xs admin-text-tertiary px-4 pb-2">
        {data.map((day, index) => (
          <div key={day.date} className="text-center">
            {day.formattedDate}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Revenue</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>Boxes</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Users</span>
        </div>
      </div>
    </div>
  );
};

export const AdminRevenueChart: React.FC<AdminRevenueChartProps> = ({ data, className }) => {
  // Get last 10 days of data
  const last10Days = data.slice(-10);
  
  // Calculate totals for the period
  const totalRevenue = last10Days.reduce((sum, day) => sum + day.revenue, 0);
  const totalBoxes = last10Days.reduce((sum, day) => sum + day.openBoxCount, 0);
  const totalUsers = last10Days.reduce((sum, day) => sum + day.newUsersCount, 0);
  
  const averageRevenue = totalRevenue / last10Days.length;
  const averageBoxes = totalBoxes / last10Days.length;
  const averageUsers = totalUsers / last10Days.length;

  // Format data for Recharts
  const chartData = last10Days.map(day => ({
    ...day,
    formattedRevenue: day.revenue.toLocaleString(),
    formattedBoxes: day.openBoxCount.toLocaleString(),
    formattedUsers: day.newUsersCount.toLocaleString()
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 min-w-[200px]">
          <p className="admin-text-primary font-medium mb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="admin-text-secondary text-sm">Revenue</span>
              </div>
              <span className="font-semibold text-green-600">${dayData.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="admin-text-secondary text-sm">Boxes Opened</span>
              </div>
              <span className="font-semibold text-purple-600">{dayData.openBoxCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="admin-text-secondary text-sm">New Users</span>
              </div>
              <span className="font-semibold text-orange-600">{dayData.newUsersCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminCard className={cn("h-full", className)}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="admin-text-primary text-lg font-semibold">Daily Overview</h3>
            <p className="admin-text-tertiary text-sm">Last 10 days - Revenue, Boxes, Users</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="admin-text-primary text-sm font-medium">
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="admin-text-primary text-sm font-medium">
                {totalBoxes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="admin-text-primary text-sm font-medium">
                {totalUsers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 mb-4 h-[360px] min-h-[360px]">
          {(() => {
            try {
              const chartData = {
                labels: last10Days.map(day => day.formattedDate),
                datasets: [
                  {
                    label: 'Revenue ($)',
                    data: last10Days.map(day => day.revenue),
                    borderColor: '#10b981', // Green for revenue
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1,
                    tension: 0.4,
                    yAxisID: 'y',
                    fill: true,
                  },
                  {
                    label: 'Boxes Opened',
                    data: last10Days.map(day => day.openBoxCount),
                    borderColor: '#3b82f6', // Blue for boxes
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1,
                    tension: 0.4,
                    yAxisID: 'y1',
                    fill: true,
                  },
                  {
                    label: 'New Users',
                    data: last10Days.map(day => day.newUsersCount),
                    borderColor: '#f59e0b', // Amber for users
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1,
                    tension: 0.4,
                    yAxisID: 'y1',
                    fill: true,
                  },
                ],
              };

              const options = {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index' as const,
                  intersect: false,
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top' as const,
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12,
                        weight: 'normal' as const,
                      },
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                      label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.dataset.label === 'Revenue ($)') {
                          label += '$' + context.parsed.y.toLocaleString();
                        } else {
                          label += context.parsed.y.toLocaleString();
                        }
                        return label;
                      }
                    }
                  },
                },
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Date',
                      font: {
                        size: 12,
                        weight: 'bold' as const,
                      },
                    },
                    grid: {
                      display: false,
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    title: {
                      display: true,
                      text: 'Revenue ($)',
                      font: {
                        size: 12,
                        weight: 'bold' as const,
                      },
                    },
                    ticks: {
                      callback: function(value: any) {
                        return '$' + (value / 1000).toFixed(0) + 'k';
                      },
                      font: {
                        size: 11,
                      },
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    title: {
                      display: true,
                      text: 'Count',
                      font: {
                        size: 12,
                        weight: 'bold' as const,
                      },
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              };

              return <Line data={chartData} options={options} />;
            } catch (error) {
              console.error('Chart.js error:', error);
              return <FallbackChart data={chartData} />;
            }
          })()}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="admin-text-secondary text-sm">Avg Revenue</span>
              </div>
              <span className="admin-text-primary font-medium text-sm">
                ${Math.round(averageRevenue).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="admin-text-secondary text-sm">Avg Boxes</span>
              </div>
              <span className="admin-text-primary font-medium text-sm">
                {Math.round(averageBoxes).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="admin-text-secondary text-sm">Avg Users</span>
              </div>
              <span className="admin-text-primary font-medium text-sm">
                {Math.round(averageUsers).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
};
