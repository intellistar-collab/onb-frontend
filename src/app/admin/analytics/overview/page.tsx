"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      changeType: "positive" as const,
      icon: Users,
      description: "from last month",
    },
    {
      title: "Boxes Opened",
      value: "12,234",
      change: "+19%",
      changeType: "positive" as const,
      icon: BarChart3,
      description: "from last month",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.4%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "from last month",
    },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Analytics Overview"
            description="Comprehensive view of your platform's performance and key metrics"
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium admin-text-tertiary">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 admin-text-tertiary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold admin-text-primary">{stat.value}</div>
                  <p className="text-xs admin-text-tertiary">
                    <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>{" "}
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">Revenue chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">User growth chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Boxes</CardTitle>
                <CardDescription>Most popular box categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mystery Gold", sales: 234, revenue: "$12,345" },
                    { name: "Lucky Silver", sales: 189, revenue: "$8,901" },
                    { name: "Bronze Box", sales: 156, revenue: "$5,678" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="admin-text-primary font-medium">{item.name}</p>
                        <p className="admin-text-tertiary text-sm">{item.sales} sales</p>
                      </div>
                      <p className="admin-text-primary font-semibold">{item.revenue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { country: "United States", users: 1234, percentage: 45 },
                    { country: "Canada", users: 567, percentage: 21 },
                    { country: "United Kingdom", users: 345, percentage: 13 },
                    { country: "Germany", users: 234, percentage: 9 },
                    { country: "Others", users: 345, percentage: 12 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="admin-text-primary text-sm">{item.country}</span>
                        <span className="admin-text-tertiary text-sm">{item.users} users</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New user registered", time: "2 minutes ago", type: "user" },
                    { action: "Box opened - Mystery Gold", time: "5 minutes ago", type: "box" },
                    { action: "Payment received", time: "12 minutes ago", type: "payment" },
                    { action: "User level up", time: "18 minutes ago", type: "level" },
                    { action: "New achievement unlocked", time: "25 minutes ago", type: "achievement" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="admin-text-primary text-sm">{item.action}</p>
                        <p className="admin-text-tertiary text-xs">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
