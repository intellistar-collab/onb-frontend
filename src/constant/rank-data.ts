interface RankUser {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  points: number;
  level: string;
  badge: string;
  totalBoxesOpened: number;
  winRate: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
}

interface RankCategory {
  title: string;
  banner: string;
  type: "leaderboard" | "achievements";
  users?: RankUser[];
  achievements?: Achievement[];
}

// Mock leaderboard data
export const topPlayers: RankUser[] = [
  {
    id: "1",
    username: "BoxMaster2024",
    avatar: "/home-card/onb-box.png",
    rank: 1,
    points: 15420,
    level: "Diamond",
    badge: "👑",
    totalBoxesOpened: 342,
    winRate: 87.5
  },
  {
    id: "2", 
    username: "LuckyUnboxer",
    avatar: "/home-card/onb-box.png",
    rank: 2,
    points: 14890,
    level: "Diamond",
    badge: "💎",
    totalBoxesOpened: 298,
    winRate: 82.3
  },
  {
    id: "3",
    username: "TreasureHunter",
    avatar: "/home-card/onb-box.png", 
    rank: 3,
    points: 13765,
    level: "Platinum",
    badge: "🏆",
    totalBoxesOpened: 267,
    winRate: 79.1
  },
  {
    id: "4",
    username: "BoxBuster",
    avatar: "/home-card/onb-box.png",
    rank: 4,
    points: 12340,
    level: "Platinum", 
    badge: "⭐",
    totalBoxesOpened: 234,
    winRate: 76.8
  },
  {
    id: "5",
    username: "PrizeCollector",
    avatar: "/home-card/onb-box.png",
    rank: 5,
    points: 11890,
    level: "Gold",
    badge: "🎯",
    totalBoxesOpened: 201,
    winRate: 74.2
  },
  {
    id: "6",
    username: "UnboxLegend",
    avatar: "/home-card/onb-box.png",
    rank: 6,
    points: 10567,
    level: "Gold",
    badge: "🔥",
    totalBoxesOpened: 189,
    winRate: 71.5
  }
];

// Mock achievements data
export const playerAchievements: Achievement[] = [
  {
    id: "first_box",
    title: "First Steps",
    description: "Open your first mystery box",
    icon: "📦",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    isCompleted: true
  },
  {
    id: "box_opener",
    title: "Box Opener",
    description: "Open 50 mystery boxes",
    icon: "🎁",
    rarity: "rare", 
    progress: 47,
    maxProgress: 50,
    isCompleted: false
  },
  {
    id: "lucky_streak",
    title: "Lucky Streak",
    description: "Win 10 rare items in a row",
    icon: "🍀",
    rarity: "epic",
    progress: 7,
    maxProgress: 10,
    isCompleted: false
  },
  {
    id: "treasure_master",
    title: "Treasure Master",
    description: "Collect items worth over $10,000",
    icon: "💰",
    rarity: "legendary",
    progress: 8750,
    maxProgress: 10000,
    isCompleted: false
  },
  {
    id: "world_traveler",
    title: "World Traveler",
    description: "Win experiences from 5 different countries",
    icon: "🌍",
    rarity: "epic",
    progress: 3,
    maxProgress: 5,
    isCompleted: false
  },
  {
    id: "fashion_icon",
    title: "Fashion Icon",
    description: "Collect 20 luxury fashion items",
    icon: "👗",
    rarity: "rare",
    progress: 20,
    maxProgress: 20,
    isCompleted: true
  }
];

// Rank categories for the main page
export const globalLeaderboard: RankCategory = {
  title: "Global Leaderboard",
  banner: "/home-card/banner/sports-events.webp",
  type: "leaderboard",
  users: topPlayers
};

export const weeklyLeaderboard: RankCategory = {
  title: "Weekly Champions",
  banner: "/home-card/banner/world-events.webp", 
  type: "leaderboard",
  users: topPlayers.slice(0, 3)
};

export const achievements: RankCategory = {
  title: "Achievements",
  banner: "/home-card/banner/personal-experience.webp",
  type: "achievements",
  achievements: playerAchievements
};

export const monthlyChallenge: RankCategory = {
  title: "Monthly Challenge",
  banner: "/home-card/banner/city-stays.webp",
  type: "achievements", 
  achievements: playerAchievements.filter(a => !a.isCompleted).slice(0, 3)
};

export const rankCategories = [
  globalLeaderboard,
  weeklyLeaderboard, 
  achievements,
  monthlyChallenge
];


