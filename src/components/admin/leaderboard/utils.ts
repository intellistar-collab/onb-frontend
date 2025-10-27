import { LeaderboardPlayer, LeaderboardFilters, LeaderboardStats } from "./types";

export const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return "👑"; // Crown emoji
    case 2:
      return "🥈"; // Silver medal emoji
    case 3:
      return "🥉"; // Bronze medal emoji
    default:
      return `#${rank}`;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return "🟢"; // Green circle
    case "inactive":
      return "🔴"; // Red circle
    case "suspended":
      return "🟡"; // Yellow circle
    default:
      return "⚪"; // White circle
  }
};

export const getLevelConfig = (level: string) => {
  const configs = {
    Diamond: { 
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", 
      icon: "💎" 
    },
    Gold: { 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", 
      icon: "🏆" 
    },
    Silver: { 
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", 
      icon: "🥈" 
    },
    Bronze: { 
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", 
      icon: "🥉" 
    },
  };
  return configs[level as keyof typeof configs] || configs.Bronze;
};

export const filterPlayers = (players: LeaderboardPlayer[], filters: LeaderboardFilters): LeaderboardPlayer[] => {
  let filtered = [...players];

  // Filter by level
  if (filters.level !== "all") {
    filtered = filtered.filter(player => 
      player.level.toLowerCase() === filters.level
    );
  }

  // Filter by status
  if (filters.status !== "all") {
    filtered = filtered.filter(player => player.status === filters.status);
  }

  // Sort by appropriate score based on period
  filtered.sort((a, b) => {
    let scoreA, scoreB;
    switch (filters.period) {
      case "weekly":
        scoreA = a.weeklyScore;
        scoreB = b.weeklyScore;
        break;
      case "monthly":
        scoreA = a.monthlyScore;
        scoreB = b.monthlyScore;
        break;
      default:
        scoreA = a.totalScore;
        scoreB = b.totalScore;
    }
    return scoreB - scoreA;
  });

  // Update ranks
  filtered.forEach((player, index) => {
    player.rank = index + 1;
  });

  return filtered;
};

export const calculateStats = (players: LeaderboardPlayer[]): LeaderboardStats => {
  const totalPlayers = players.length;
  const activePlayers = players.filter(player => 
    new Date(player.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const verifiedPlayers = players.filter(player => player.isVerified).length;
  const totalScore = players.reduce((sum, player) => sum + player.totalScore, 0);
  const totalSpent = players.reduce((sum, player) => sum + player.totalSpent, 0);
  const totalWon = players.reduce((sum, player) => sum + player.totalWon, 0);
  const averageScore = Math.round(totalScore / totalPlayers);
  const diamondPlayers = players.filter(player => player.level === "Diamond").length;
  const averageWinRate = players.reduce((sum, player) => sum + player.winRate, 0) / totalPlayers;
  const totalStreaks = players.reduce((sum, player) => sum + player.streak, 0);

  return {
    totalPlayers,
    activePlayers,
    verifiedPlayers,
    averageScore,
    totalRevenue: totalSpent,
    totalPayouts: totalWon,
    diamondPlayers,
    averageWinRate,
    totalStreaks,
  };
};

