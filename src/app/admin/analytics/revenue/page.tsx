"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

export default function AnalyticsRevenue() {
  const revenueStats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Monthly Recurring Revenue",
      value: "$12,450.00",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "from last month",
    },
    {
      title: "Average Order Value",
      value: "$24.50",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: TrendingDown,
      description: "from last month",
    },
    {
      title: "Payment Success Rate",
      value: "98.5%",
      change: "+0.3%",
      changeType: "positive" as const,
      icon: CreditCard,
      description: "from last month",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000, boxes: 450 },
    { month: "Feb", revenue: 15000, boxes: 520 },
    { month: "Mar", revenue: 18000, boxes: 680 },
    { month: "Apr", revenue: 22000, boxes: 750 },
    { month: "May", revenue: 25000, boxes: 820 },
    { month: "Jun", revenue: 28000, boxes: 890 },
    { month: "Jul", revenue: 32000, boxes: 950 },
    { month: "Aug", revenue: 35000, boxes: 1020 },
    { month: "Sep", revenue: 38000, boxes: 1100 },
    { month: "Oct", revenue: 42000, boxes: 1180 },
    { month: "Nov", revenue: 45000, boxes: 1250 },
    { month: "Dec", revenue: 48000, boxes: 1320 },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Revenue Analytics"
            description="Detailed analysis of revenue streams, payment trends, and financial performance"
          />

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {revenueStats.map((stat, index) => (
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

          {/* Revenue Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue growth over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">Revenue trend chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Method</CardTitle>
                <CardDescription>Distribution of revenue by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <CreditCard className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">Payment method chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Box Type</CardTitle>
                <CardDescription>Revenue distribution across box categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mystery Gold", revenue: "$18,500", percentage: 38.5, color: "bg-yellow-500" },
                    { name: "Lucky Silver", revenue: "$12,300", percentage: 25.6, color: "bg-gray-400" },
                    { name: "Bronze Box", revenue: "$8,900", percentage: 18.5, color: "bg-orange-500" },
                    { name: "Special Edition", revenue: "$5,200", percentage: 10.8, color: "bg-purple-500" },
                    { name: "Others", revenue: "$3,131", percentage: 6.6, color: "bg-blue-500" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="admin-text-primary text-sm">{item.name}</span>
                        <span className="admin-text-primary font-semibold">{item.revenue}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className="admin-text-tertiary text-xs">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Sources</CardTitle>
                <CardDescription>Highest performing revenue streams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: "Box Sales", revenue: "$32,500", growth: "+22%" },
                    { source: "Premium Subscriptions", revenue: "$8,200", growth: "+15%" },
                    { source: "Special Events", revenue: "$3,800", growth: "+45%" },
                    { source: "Referral Bonuses", revenue: "$731", growth: "+8%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg admin-bg-secondary">
                      <div>
                        <p className="admin-text-primary font-medium">{item.source}</p>
                        <p className="admin-text-tertiary text-sm">{item.revenue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 text-sm font-semibold">{item.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Projected revenue for next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold admin-text-primary mb-2">$52,000</div>
                    <p className="admin-text-tertiary text-sm">Projected Q1 Revenue</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Conservative</span>
                      <span className="admin-text-primary">$48,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Optimistic</span>
                      <span className="admin-text-primary">$55,200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Growth Rate</span>
                      <span className="text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
              <CardDescription>Detailed monthly revenue and box sales data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b admin-border-primary">
                      <th className="text-left py-3 px-4 admin-text-tertiary font-medium">Month</th>
                      <th className="text-right py-3 px-4 admin-text-tertiary font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 admin-text-tertiary font-medium">Boxes Sold</th>
                      <th className="text-right py-3 px-4 admin-text-tertiary font-medium">Avg. Price</th>
                      <th className="text-right py-3 px-4 admin-text-tertiary font-medium">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, index) => (
                      <tr key={index} className="border-b admin-border-primary">
                        <td className="py-3 px-4 admin-text-primary font-medium">{item.month}</td>
                        <td className="py-3 px-4 text-right admin-text-primary">${item.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right admin-text-primary">{item.boxes.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right admin-text-primary">
                          ${(item.revenue / item.boxes).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600">
                          +{((item.revenue - (index > 0 ? revenueData[index - 1].revenue : item.revenue)) / (index > 0 ? revenueData[index - 1].revenue : item.revenue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}
