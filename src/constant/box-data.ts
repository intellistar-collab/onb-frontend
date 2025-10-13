export type RewardTier = "legendary" | "epic" | "rare" | "uncommon"

export interface BoxReward {
  id: string
  name: string
  image: string
  price: string
  odds: string
  tier: RewardTier
  description?: string
}

export interface BoxStat {
  label: string
  value: string
}

export type BoxStatus = "OPEN" | "COMING SOON"

export interface MysteryBox {
  id: string
  title: string
  location: string
  status: BoxStatus
  price: string
  tag: string
  star: number
  image: string
  heroImage: string
  percentage: string
  color: string
  experience: number
  description: string
  shippingInfo: string
  href: string
  rewards: BoxReward[]
  stats: BoxStat[]
}

export interface BoxCategory {
  id: string
  name: string
  order: number
  color: string
  photo: string
  boxes: MysteryBox[]
}

const createRewards = (): BoxReward[] => [
  {
    id: "reward-ap",
    name: "Audemars Piguet Royal Oak",
    image: "/box/box-item/box2.webp",
    price: "$25,000",
    odds: "0.12%",
    tier: "legendary",
  },
  {
    id: "reward-macbook",
    name: "MacBook Pro M3 Max",
    image: "/box/box-item/box5.webp",
    price: "$3,499",
    odds: "0.65%",
    tier: "epic",
  },
  {
    id: "reward-lv-bag",
    name: "Louis Vuitton Bumbag",
    image: "/box/box-item/box6.webp",
    price: "$2,120",
    odds: "0.90%",
    tier: "epic",
  },
  {
    id: "reward-ps5",
    name: "PlayStation 5 Pro",
    image: "/box/box-item/box8.webp",
    price: "$799",
    odds: "2.30%",
    tier: "rare",
  },
  {
    id: "reward-sneakers",
    name: "Jordan Retro Sneakers",
    image: "/box/box-item/box1.webp",
    price: "$320",
    odds: "5.80%",
    tier: "rare",
  },
  {
    id: "reward-airpods",
    name: "AirPods Pro",
    image: "/box/box-item/box3.webp",
    price: "$249",
    odds: "9.50%",
    tier: "uncommon",
  },
]

const baseStats: BoxStat[] = [
  {
    label: "Drop Frequency",
    value: "Every 48 hours",
  },
  {
    label: "Total Items",
    value: "35 curated prizes",
  },
  {
    label: "Top Reward",
    value: "$25K watch",
  },
  {
    label: "Best Odds",
    value: "9.5% tier",
  },
]

export const mockBoxCategories: BoxCategory[] = [
  {
    id: "dubai-luxury",
    name: "Dubai Luxury",
    order: 1,
    color: "#e081ae",
    photo: "/home-card/banner/city-stays.webp",
    boxes: [
      {
        id: "dubai-sancz",
        title: "Dubai Marina Sancz",
        location: "DXB",
        status: "OPEN",
        price: "$5,000",
        tag: "MOST WANTED",
        star: 5,
        image: "/box/box-item/box2.webp",
        heroImage: "/box/box-item/box2.webp",
        percentage: "0.010%",
        color: "#e081ae",
        experience: 1999,
        description:
          "A high-stakes mystery box inspired by the Dubai Marina skyline with premium streetwear and rare tech.",
        shippingInfo: "Global shipping within 5 business days",
        href: "/box/dubai-sancz",
        rewards: createRewards(),
        stats: baseStats,
      },
      {
        id: "desert-mirage",
        title: "Desert Mirage",
        location: "DXB",
        status: "OPEN",
        price: "$2,000",
        tag: "IN DEMAND",
        star: 3,
        image: "/box/box-item/box6.webp",
        heroImage: "/box/box-item/box6.webp",
        percentage: "0.050%",
        color: "#fbbf24",
        experience: 850,
        description:
          "Curated lifestyle drops blending luxury desert essentials with cutting-edge gadgets.",
        shippingInfo: "Ships in 72 hours",
        href: "/box/desert-mirage",
        rewards: createRewards(),
        stats: baseStats,
      },
      {
        id: "midnight-gold",
        title: "Midnight Gold",
        location: "DXB",
        status: "OPEN",
        price: "$1,200",
        tag: "UNCOMMON",
        star: 2,
        image: "/box/box-item/box4.webp",
        heroImage: "/box/box-item/box4.webp",
        percentage: "0.120%",
        color: "#38bdf8",
        experience: 540,
        description:
          "Balanced odds with premium audio gear, sneakers, and exclusive accessories.",
        shippingInfo: "Preorder drop - ships on release",
        href: "/box/midnight-gold",
        rewards: createRewards(),
        stats: baseStats,
      },
    ],
  },
  {
    id: "city-drip",
    name: "City Drip",
    order: 2,
    color: "#6366f1",
    photo: "/home-card/banner/drip-city.webp",
    boxes: [
      {
        id: "brooklyn-heat",
        title: "Brooklyn Heat",
        location: "NYC",
        status: "OPEN",
        price: "$1,500",
        tag: "MOST WANTED",
        star: 5,
        image: "/box/box-item/box0.webp",
        heroImage: "/box/box-item/box0.webp",
        percentage: "0.025%",
        color: "#6366f1",
        experience: 1200,
        description:
          "Streetwear icons and limited sneakers curated straight out of Brooklyn.",
        shippingInfo: "Ships within the US in 3 days",
        href: "/box/brooklyn-heat",
        rewards: createRewards(),
        stats: baseStats,
      },
      {
        id: "soho-signature",
        title: "SoHo Signature",
        location: "NYC",
        status: "OPEN",
        price: "$950",
        tag: "IN DEMAND",
        star: 3,
        image: "/box/box-item/box7.webp",
        heroImage: "/box/box-item/box7.webp",
        percentage: "0.080%",
        color: "#14b8a6",
        experience: 720,
        description:
          "Refined New York staples with rare collab pieces and smart tech.",
        shippingInfo: "Guaranteed shipping in 5 days",
        href: "/box/soho-signature",
        rewards: createRewards(),
        stats: baseStats,
      },
      {
        id: "uptown-nightfall",
        title: "Uptown Nightfall",
        location: "NYC",
        status: "COMING SOON",
        price: "$640",
        tag: "UNCOMMON",
        star: 2,
        image: "/box/box-item/box3.webp",
        heroImage: "/box/box-item/box3.webp",
        percentage: "0.150%",
        color: "#22d3ee",
        experience: 460,
        description:
          "A mix of nightlife essentials with versatile gadgets and premium fragrances.",
        shippingInfo: "Ships on next release window",
        href: "/box/uptown-nightfall",
        rewards: createRewards(),
        stats: baseStats,
      },
    ],
  },
  {
    id: "world-tour",
    name: "World Tour",
    order: 3,
    color: "#f97316",
    photo: "/home-card/banner/world-events.webp",
    boxes: [
      {
        id: "tokyo-neon",
        title: "Tokyo Neon",
        location: "TYO",
        status: "OPEN",
        price: "$1,800",
        tag: "MOST WANTED",
        star: 5,
        image: "/box/box-item/box5.webp",
        heroImage: "/box/box-item/box5.webp",
        percentage: "0.030%",
        color: "#f97316",
        experience: 1350,
        description:
          "Electric mix of Japanese streetwear collabs and tech exclusives.",
        shippingInfo: "International shipping in 4 days",
        href: "/box/tokyo-neon",
        rewards: createRewards(),
        stats: baseStats,
      },
      {
        id: "london-royale",
        title: "London Royale",
        location: "LDN",
        status: "OPEN",
        price: "$1,050",
        tag: "IN DEMAND",
        star: 3,
        image: "/box/box-item/box1.webp",
        heroImage: "/box/box-item/box1.webp",
        percentage: "0.090%",
        color: "#facc15",
        experience: 780,
        description:
          "Modern British luxury with iconic timepieces and bespoke accessories.",
        shippingInfo: "Ships from UK warehouse in 3 days",
        href: "/box/london-royale",
        rewards: createRewards(),
        stats: baseStats,
      },
      {
        id: "miami-splash",
        title: "Miami Splash",
        location: "MIA",
        status: "COMING SOON",
        price: "$720",
        tag: "UNCOMMON",
        star: 2,
        image: "/box/box-item/box8.webp",
        heroImage: "/box/box-item/box8.webp",
        percentage: "0.180%",
        color: "#34d399",
        experience: 480,
        description:
          "Vibrant coastal pieces with high-energy gadgets and travel must-haves.",
        shippingInfo: "Opens next season",
        href: "/box/miami-splash",
        rewards: createRewards(),
        stats: baseStats,
      },
    ],
  },
]

export const featuredMysteryBox = mockBoxCategories[0].boxes[0]

