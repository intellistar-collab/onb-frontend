"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Star, Zap, Gift, Target } from "lucide-react";

export default function AnalyticsBoxes() {
  const boxStats = [
    {
      title: "Total Boxes Opened",
      value: "45,678",
      change: "+18.5%",
      changeType: "positive" as const,
      icon: Package,
      description: "from last month",
    },
    {
      title: "Average Box Value",
      value: "$24.50",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: Star,
      description: "from last month",
    },
    {
      title: "Success Rate",
      value: "78.3%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Target,
      description: "from last month",
    },
    {
      title: "Rare Items Found",
      value: "1,234",
      change: "+12.7%",
      changeType: "positive" as const,
      icon: Gift,
      description: "this month",
    },
  ];

  const boxCategories = [
    { name: "Mystery Gold", opened: 12340, revenue: "$18,500", avgValue: "$1.50", color: "bg-yellow-500" },
    { name: "Lucky Silver", opened: 8900, revenue: "$12,300", avgValue: "$1.38", color: "bg-gray-400" },
    { name: "Bronze Box", opened: 15600, revenue: "$8,900", avgValue: "$0.57", color: "bg-orange-500" },
    { name: "Special Edition", opened: 3200, revenue: "$5,200", avgValue: "$1.63", color: "bg-purple-500" },
    { name: "Holiday Box", opened: 2800, revenue: "$3,800", avgValue: "$1.36", color: "bg-red-500" },
    { name: "Starter Pack", opened: 4838, revenue: "$2,400", avgValue: "$0.50", color: "bg-blue-500" },
  ];

  const topItems = [
    { name: "Legendary Sword", rarity: "Legendary", found: 23, value: "$500", color: "text-yellow-500" },
    { name: "Epic Shield", rarity: "Epic", found: 156, value: "$150", color: "text-purple-500" },
    { name: "Rare Gem", rarity: "Rare", found: 890, value: "$75", color: "text-blue-500" },
    { name: "Magic Potion", rarity: "Uncommon", found: 2340, value: "$25", color: "text-green-500" },
    { name: "Common Coin", rarity: "Common", found: 15600, value: "$5", color: "text-gray-500" },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Box Analytics"
            description="Detailed analysis of box opening patterns, item distribution, and user engagement"
          />

          {/* Box Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {boxStats.map((stat, index) => (
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

          {/* Box Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Box Opening Trends</CardTitle>
                <CardDescription>Daily box opening activity over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <Package className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">Box opening trends chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Item Rarity Distribution</CardTitle>
                <CardDescription>Distribution of items by rarity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <Gift className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">Rarity distribution chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Box Categories */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Box Category Performance</CardTitle>
              <CardDescription>Performance metrics for each box category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {boxCategories.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${category.color}`}></div>
                        <span className="admin-text-primary font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <span className="admin-text-tertiary">{category.opened.toLocaleString()} opened</span>
                        <span className="admin-text-primary font-semibold">{category.revenue}</span>
                        <span className="admin-text-tertiary">Avg: {category.avgValue}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full`}
                        style={{ width: `${(category.opened / Math.max(...boxCategories.map(c => c.opened))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Items and User Behavior */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Most Found Items</CardTitle>
                <CardDescription>Top items discovered in boxes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg admin-bg-secondary">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Gift className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="admin-text-primary font-medium">{item.name}</p>
                          <p className={`text-xs ${item.color}`}>{item.rarity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="admin-text-primary font-semibold">{item.found.toLocaleString()}</p>
                        <p className="admin-text-tertiary text-xs">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Box Behavior</CardTitle>
                <CardDescription>How users interact with boxes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Average Boxes per User</span>
                      <span className="admin-text-primary">3.7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Most Popular Time</span>
                      <span className="admin-text-primary">7:00 PM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Peak Opening Day</span>
                      <span className="admin-text-primary">Saturday</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Mobile vs Desktop</span>
                      <span className="admin-text-primary">68% / 32%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Repeat Openers</span>
                      <span className="admin-text-primary">89.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Social Sharing</span>
                      <span className="admin-text-primary">23.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Box Opening Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Opening Patterns</CardTitle>
                <CardDescription>User opening behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold admin-text-primary mb-2">4.2</div>
                    <p className="admin-text-tertiary text-sm">Avg Boxes per Session</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Single Box Openers</span>
                      <span className="admin-text-primary">45.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Bulk Openers (5+)</span>
                      <span className="admin-text-primary">23.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Daily Openers</span>
                      <span className="admin-text-primary">67.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Item Satisfaction</CardTitle>
                <CardDescription>User satisfaction with box contents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold admin-text-primary mb-2">4.6/5</div>
                    <p className="admin-text-tertiary text-sm">Average Rating</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">5 Stars</span>
                      <span className="admin-text-primary">68.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">4 Stars</span>
                      <span className="admin-text-primary">22.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">3 Stars</span>
                      <span className="admin-text-primary">7.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Below 3 Stars</span>
                      <span className="admin-text-primary">1.9%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rare Item Events</CardTitle>
                <CardDescription>Special events and rare item drops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Legendary Items</span>
                      <span className="admin-text-primary">23 found</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Epic Items</span>
                      <span className="admin-text-primary">156 found</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Special Events</span>
                      <span className="admin-text-primary">12 active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Drop Rate Boost</span>
                      <span className="admin-text-primary">+25% active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Box Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Box Activity</CardTitle>
              <CardDescription>Latest box opening events and discoveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Alex Johnson", box: "Mystery Gold", item: "Legendary Sword", rarity: "Legendary", time: "2 minutes ago" },
                  { user: "Sarah Chen", box: "Lucky Silver", item: "Epic Shield", rarity: "Epic", time: "5 minutes ago" },
                  { user: "Mike Rodriguez", box: "Bronze Box", item: "Magic Potion", rarity: "Uncommon", time: "8 minutes ago" },
                  { user: "Emma Wilson", box: "Special Edition", item: "Rare Gem", rarity: "Rare", time: "12 minutes ago" },
                  { user: "David Kim", box: "Holiday Box", item: "Festive Coin", rarity: "Common", time: "15 minutes ago" },
                  { user: "Lisa Park", box: "Mystery Gold", item: "Golden Key", rarity: "Rare", time: "18 minutes ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg admin-bg-secondary">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="admin-text-primary font-medium">{activity.user}</p>
                      <p className="admin-text-tertiary text-sm">
                        Found <span className="font-semibold">{activity.item}</span> in {activity.box}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        activity.rarity === 'Legendary' ? 'text-yellow-500' :
                        activity.rarity === 'Epic' ? 'text-purple-500' :
                        activity.rarity === 'Rare' ? 'text-blue-500' :
                        'text-gray-500'
                      }`}>
                        {activity.rarity}
                      </p>
                      <p className="admin-text-tertiary text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}
