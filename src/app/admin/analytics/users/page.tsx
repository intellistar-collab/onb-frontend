"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCheck, UserX, Activity, Clock } from "lucide-react";

export default function AnalyticsUsers() {
  const userStats = [
    {
      title: "Total Users",
      value: "12,450",
      change: "+15.2%",
      changeType: "positive" as const,
      icon: Users,
      description: "from last month",
    },
    {
      title: "New Registrations",
      value: "1,234",
      change: "+22.1%",
      changeType: "positive" as const,
      icon: UserPlus,
      description: "this month",
    },
    {
      title: "Active Users",
      value: "8,920",
      change: "+8.5%",
      changeType: "positive" as const,
      icon: UserCheck,
      description: "last 30 days",
    },
    {
      title: "Churned Users",
      value: "156",
      change: "-12.3%",
      changeType: "positive" as const,
      icon: UserX,
      description: "this month",
    },
  ];

  const userSegments = [
    { segment: "New Users (0-30 days)", count: 1234, percentage: 9.9, color: "bg-blue-500" },
    { segment: "Regular Users (1-6 months)", count: 4567, percentage: 36.7, color: "bg-green-500" },
    { segment: "Loyal Users (6+ months)", count: 5234, percentage: 42.0, color: "bg-purple-500" },
    { segment: "VIP Users", count: 1415, percentage: 11.4, color: "bg-yellow-500" },
  ];

  const topCountries = [
    { country: "United States", users: 5234, percentage: 42.0 },
    { country: "Canada", users: 1890, percentage: 15.2 },
    { country: "United Kingdom", users: 1234, percentage: 9.9 },
    { country: "Germany", users: 890, percentage: 7.1 },
    { country: "Australia", users: 567, percentage: 4.6 },
    { country: "Others", users: 2635, percentage: 21.2 },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="User Analytics"
            description="Comprehensive analysis of user behavior, demographics, and engagement patterns"
          />

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {userStats.map((stat, index) => (
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

          {/* User Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>User registration and growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <Users className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">User growth chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Heatmap</CardTitle>
                <CardDescription>User activity patterns throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center admin-bg-secondary rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 admin-text-tertiary mx-auto mb-4" />
                    <p className="admin-text-tertiary">Activity heatmap will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
                <CardDescription>Distribution of users by engagement level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSegments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="admin-text-primary text-sm">{segment.segment}</span>
                        <span className="admin-text-primary font-semibold">{segment.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${segment.color} h-2 rounded-full`}
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className="admin-text-tertiary text-xs">{segment.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by country and region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCountries.map((country, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="admin-text-primary text-sm">{country.country}</span>
                        <span className="admin-text-primary font-semibold">{country.users.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className="admin-text-tertiary text-xs">{country.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Behavior */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>Average time users spend on platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold admin-text-primary mb-2">24m 32s</div>
                    <p className="admin-text-tertiary text-sm">Average Session</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Mobile</span>
                      <span className="admin-text-primary">18m 45s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Desktop</span>
                      <span className="admin-text-primary">32m 18s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Tablet</span>
                      <span className="admin-text-primary">22m 12s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User retention rates by cohort</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Day 1</span>
                      <span className="admin-text-primary">85.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Day 7</span>
                      <span className="admin-text-primary">67.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Day 30</span>
                      <span className="admin-text-primary">45.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Day 90</span>
                      <span className="admin-text-primary">28.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Times</CardTitle>
                <CardDescription>When users are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Peak Hour</span>
                      <span className="admin-text-primary">7:00 PM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Peak Day</span>
                      <span className="admin-text-primary">Saturday</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Peak Month</span>
                      <span className="admin-text-primary">December</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-tertiary">Lowest Activity</span>
                      <span className="admin-text-primary">3:00 AM - 6:00 AM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent User Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest user actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Alex Johnson", action: "Opened Mystery Gold Box", time: "2 minutes ago", type: "box" },
                  { user: "Sarah Chen", action: "Reached Diamond Level", time: "5 minutes ago", type: "level" },
                  { user: "Mike Rodriguez", action: "Completed Daily Quest", time: "8 minutes ago", type: "quest" },
                  { user: "Emma Wilson", action: "Shared Achievement", time: "12 minutes ago", type: "social" },
                  { user: "David Kim", action: "Purchased Premium Box", time: "15 minutes ago", type: "purchase" },
                  { user: "Lisa Park", action: "Joined Guild", time: "18 minutes ago", type: "guild" },
                  { user: "James Brown", action: "Unlocked New Badge", time: "22 minutes ago", type: "badge" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg admin-bg-secondary">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="admin-text-primary font-medium">{activity.user}</p>
                      <p className="admin-text-tertiary text-sm">{activity.action}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 admin-text-tertiary" />
                      <span className="admin-text-tertiary text-sm">{activity.time}</span>
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
