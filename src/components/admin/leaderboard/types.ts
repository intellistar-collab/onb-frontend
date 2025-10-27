export interface LeaderboardPlayer {
  id: string;
  rank: number;
  username: string;
  displayName: string;
  avatar: string;
  totalScore: number;
  weeklyScore: number;
  monthlyScore: number;
  boxesOpened: number;
  winRate: number;
  streak: number;
  maxStreak: number;
  level: "Diamond" | "Gold" | "Silver" | "Bronze";
  levelProgress: number;
  badges: string[];
  lastActive: Date;
  joinDate: Date;
  totalSpent: number;
  totalWon: number;
  netProfit: number;
  favoriteBox: string;
  achievements: number;
  referrals: number;
  status: "active" | "inactive" | "suspended";
  isVerified: boolean;
  country: string;
  timezone: string;
}

export interface LeaderboardFilters {
  period: "all" | "weekly" | "monthly";
  level: "all" | "diamond" | "gold" | "silver" | "bronze";
  status: "all" | "active" | "inactive" | "suspended";
}

export interface LeaderboardStats {
  totalPlayers: number;
  activePlayers: number;
  verifiedPlayers: number;
  averageScore: number;
  totalRevenue: number;
  totalPayouts: number;
  diamondPlayers: number;
  averageWinRate: number;
  totalStreaks: number;
}

export interface PlayerRankIconProps {
  rank: number;
  className?: string;
}

export interface PlayerStatusIconProps {
  status: string;
  className?: string;
}

export interface LevelBadgeProps {
  level: string;
  progress?: number;
  className?: string;
}

export interface PlayerCardProps {
  player: LeaderboardPlayer;
  showRank?: boolean;
  showStats?: boolean;
  showFinancial?: boolean;
  className?: string;
}

export interface TopPlayersCardProps {
  players: LeaderboardPlayer[];
  maxPlayers?: number;
  className?: string;
}

export interface QuickStatsCardProps {
  players: LeaderboardPlayer[];
  className?: string;
}

export interface RecentActivityCardProps {
  players: LeaderboardPlayer[];
  maxPlayers?: number;
  className?: string;
}

export interface LeaderboardFiltersProps {
  filters: LeaderboardFilters;
  onFiltersChange: (filters: LeaderboardFilters) => void;
  className?: string;
}

export interface LeaderboardTableProps {
  players: LeaderboardPlayer[];
  filters: LeaderboardFilters;
  loading?: boolean;
  onPlayerAction?: (action: string, player: LeaderboardPlayer) => void;
  className?: string;
}

export interface LevelDistributionCardProps {
  players: LeaderboardPlayer[];
  className?: string;
}

export interface GeographicDistributionCardProps {
  players: LeaderboardPlayer[];
  className?: string;
}

export interface AchievementLeaderboardCardProps {
  players: LeaderboardPlayer[];
  maxPlayers?: number;
  className?: string;
}
