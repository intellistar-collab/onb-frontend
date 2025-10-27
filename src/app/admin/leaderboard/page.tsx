"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader, AdminTable } from "@/components/admin";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  TrendingUp, 
  Users,
  Star,
  Zap
} from "lucide-react";

// Mock leaderboard data
const mockLeaderboardData = [
  {
    id: "1",
    rank: 1,
    username: "BoxMaster2024",
    displayName: "Alex Johnson",
    avatar: "/avatars/alex.jpg",
    totalScore: 15420,
    weeklyScore: 2340,
    boxesOpened: 89,
    winRate: 0.78,
    streak: 12,
    level: "Diamond",
    badges: ["High Roller", "Lucky Streak", "Box Collector"],
    lastActive: new Date("2024-01-15T14:30:00"),
    joinDate: new Date("2023-06-15"),
  },
  {
    id: "2",
    rank: 2,
    username: "LuckyBoxer",
    displayName: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    totalScore: 14280,
    weeklyScore: 1890,
    boxesOpened: 76,
    winRate: 0.72,
    streak: 8,
    level: "Diamond",
    badges: ["Box Collector", "Consistent Player"],
    lastActive: new Date("2024-01-15T12:15:00"),
    joinDate: new Date("2023-08-22"),
  },
  {
    id: "3",
    rank: 3,
    username: "BoxHunter",
    displayName: "Mike Rodriguez",
    avatar: "/avatars/mike.jpg",
    totalScore: 12850,
    weeklyScore: 1650,
    boxesOpened: 92,
    winRate: 0.68,
    streak: 5,
    level: "Gold",
    badges: ["Box Hunter", "Rising Star"],
    lastActive: new Date("2024-01-15T09:45:00"),
    joinDate: new Date("2023-09-10"),
  },
  {
    id: "4",
    rank: 4,
    username: "MysteryBoxPro",
    displayName: "Emma Wilson",
    avatar: "/avatars/emma.jpg",
    totalScore: 11560,
    weeklyScore: 1420,
    boxesOpened: 68,
    winRate: 0.75,
    streak: 15,
    level: "Gold",
    badges: ["Mystery Master", "Lucky Streak"],
    lastActive: new Date("2024-01-14T18:20:00"),
    joinDate: new Date("2023-07-05"),
  },
  {
    id: "5",
    rank: 5,
    username: "BoxWizard",
    displayName: "David Kim",
    avatar: "/avatars/david.jpg",
    totalScore: 10890,
    weeklyScore: 980,
    boxesOpened: 81,
    winRate: 0.65,
    streak: 3,
    level: "Gold",
    badges: ["Box Wizard", "Steady Player"],
    lastActive: new Date("2024-01-14T16:10:00"),
    joinDate: new Date("2023-10-12"),
  },
  {
    id: "6",
    rank: 6,
    username: "LuckyCharm",
    displayName: "Lisa Park",
    avatar: "/avatars/lisa.jpg",
    totalScore: 9870,
    weeklyScore: 1230,
    boxesOpened: 54,
    winRate: 0.82,
    streak: 7,
    level: "Silver",
    badges: ["Lucky Charm", "High Win Rate"],
    lastActive: new Date("2024-01-14T14:30:00"),
    joinDate: new Date("2023-11-08"),
  },
  {
    id: "7",
    rank: 7,
    username: "BoxExplorer",
    displayName: "James Brown",
    avatar: "/avatars/james.jpg",
    totalScore: 9230,
    weeklyScore: 890,
    boxesOpened: 73,
    winRate: 0.58,
    streak: 2,
    level: "Silver",
    badges: ["Explorer", "Box Collector"],
    lastActive: new Date("2024-01-14T11:45:00"),
    joinDate: new Date("2023-12-01"),
  },
  {
    id: "8",
    rank: 8,
    username: "MysterySeeker",
    displayName: "Anna Taylor",
    avatar: "/avatars/anna.jpg",
    totalScore: 8760,
    weeklyScore: 1100,
    boxesOpened: 45,
    winRate: 0.71,
    streak: 4,
    level: "Silver",
    badges: ["Mystery Seeker", "Rising Star"],
    lastActive: new Date("2024-01-14T08:20:00"),
    joinDate: new Date("2023-11-20"),
  },
  {
    id: "9",
    rank: 9,
    username: "BoxChampion",
    displayName: "Robert Lee",
    avatar: "/avatars/robert.jpg",
    totalScore: 8120,
    weeklyScore: 750,
    boxesOpened: 62,
    winRate: 0.63,
    streak: 1,
    level: "Bronze",
    badges: ["Champion", "Steady Player"],
    lastActive: new Date("2024-01-13T20:15:00"),
    joinDate: new Date("2023-12-15"),
  },
  {
    id: "10",
    rank: 10,
    username: "LuckyBox",
    displayName: "Maria Garcia",
    avatar: "/avatars/maria.jpg",
    totalScore: 7890,
    weeklyScore: 650,
    boxesOpened: 38,
    winRate: 0.69,
    streak: 6,
    level: "Bronze",
    badges: ["Lucky Box", "New Player"],
    lastActive: new Date("2024-01-13T17:30:00"),
    joinDate: new Date("2024-01-02"),
  },
];

export default function AdminLeaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = mockLeaderboardData;

    if (selectedLevel !== "all") {
      filtered = filtered.filter(user => user.level.toLowerCase() === selectedLevel);
    }

    return filtered;
  }, [selectedLevel]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = mockLeaderboardData.length;
    const activeUsers = mockLeaderboardData.filter(user => 
      new Date(user.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const totalScore = mockLeaderboardData.reduce((sum, user) => sum + user.totalScore, 0);
    const avgScore = Math.round(totalScore / totalUsers);

    return [
      {
        label: "Total Players",
        value: totalUsers.toLocaleString(),
        icon: <Users className="w-6 h-6" />,
        trend: { value: "+5%", isPositive: true },
      },
      {
        label: "Active This Week",
        value: activeUsers.toLocaleString(),
        icon: <TrendingUp className="w-6 h-6" />,
        trend: { value: "+12%", isPositive: true },
      },
      {
        label: "Average Score",
        value: avgScore.toLocaleString(),
        icon: <Star className="w-6 h-6" />,
        trend: { value: "+8%", isPositive: true },
      },
      {
        label: "Total Score",
        value: totalScore.toLocaleString(),
        icon: <Trophy className="w-6 h-6" />,
        trend: { value: "+15%", isPositive: true },
      },
    ];
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-600 dark:text-slate-400">#{rank}</span>;
    }
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      Diamond: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", icon: <Crown className="h-3 w-3" /> },
      Gold: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: <Trophy className="h-3 w-3" /> },
      Silver: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", icon: <Medal className="h-3 w-3" /> },
      Bronze: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", icon: <Award className="h-3 w-3" /> },
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.Bronze;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {level}
      </Badge>
    );
  };

  const columns = [
    {
      key: "rank",
      label: "Rank",
      className: "w-20",
      render: (value: number) => (
        <div className="flex items-center justify-center">
          {getRankIcon(value)}
        </div>
      ),
    },
    {
      key: "player",
      label: "Player",
      className: "w-1/3",
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.avatar} />
            <AvatarFallback>{row.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="admin-text-primary font-semibold truncate">{row.displayName}</p>
            <p className="admin-text-tertiary text-sm truncate">@{row.username}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {row.badges.slice(0, 2).map((badge: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
              {row.badges.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{row.badges.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "totalScore",
      label: "Total Score",
      className: "w-24",
      render: (value: number) => (
        <div className="text-right">
          <span className="admin-text-primary font-bold text-lg">{value.toLocaleString()}</span>
          <div className="admin-text-tertiary text-xs">points</div>
        </div>
      ),
    },
    {
      key: "weeklyScore",
      label: "This Week",
      className: "w-24",
      render: (value: number) => (
        <div className="text-right">
          <span className="admin-text-primary font-semibold">{value.toLocaleString()}</span>
          <div className="admin-text-tertiary text-xs">points</div>
        </div>
      ),
    },
    {
      key: "level",
      label: "Level",
      className: "w-24",
      render: (value: string) => getLevelBadge(value),
    },
    {
      key: "stats",
      label: "Stats",
      className: "w-32",
      render: (value: any, row: any) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Boxes:</span>
            <span className="admin-text-primary font-medium">{row.boxesOpened}</span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Win Rate:</span>
            <span className="admin-text-primary font-medium">{(row.winRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Streak:</span>
            <span className="admin-text-primary font-medium flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              {row.streak}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "lastActive",
      label: "Last Active",
      className: "w-28",
      render: (value: Date) => (
        <div className="text-sm">
          <span className="admin-text-primary">{value.toLocaleDateString()}</span>
          <div className="admin-text-tertiary text-xs">{value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "View Profile",
      icon: <Users className="h-4 w-4" />,
      onClick: (row: any) => {
        console.log("View profile:", row.username);
        // TODO: Navigate to user profile
      },
    },
    {
      label: "View Activity",
      icon: <TrendingUp className="h-4 w-4" />,
      onClick: (row: any) => {
        console.log("View activity:", row.username);
        // TODO: Navigate to user activity
      },
    },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Leaderboard"
            description="Track top players and their achievements in the mystery box game"
            actions={
              <div className="flex gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 rounded-md admin-input text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="weekly">This Week</option>
                  <option value="monthly">This Month</option>
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 rounded-md admin-input text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="diamond">Diamond</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            }
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="admin-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="admin-text-tertiary text-sm font-medium">{stat.label}</p>
                    <p className="admin-text-primary text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs font-medium ${
                        stat.trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.trend.value}
                      </span>
                      <span className="admin-text-tertiary text-xs ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className="admin-text-tertiary">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard Table */}
          <AdminTable
            title="Player Rankings"
            description={`${filteredData.length} players ranked by total score`}
            data={filteredData}
            columns={columns}
            actions={actions}
            emptyMessage="No players found"
            searchable={true}
            searchPlaceholder="Search players by name or username..."
            pageSize={20}
            showPagination={true}
          />
        </div>
      </div>
    </AdminRoute>
  );
}
