import { Box } from '@/lib/api/boxes';
import { BoxCategory } from '@/lib/api/box-categories';
import { Item } from '@/lib/api/items';
import { MysteryBox, BoxReward, RewardTier } from '@/constant/box-data';

/**
 * Transform database Box data to MysteryBox format for UI components
 */
export function transformBoxToMysteryBox(box: Box): MysteryBox {
  return {
    id: box.id,
    title: box.title,
    location: box.location,
    status: box.isActive ? "OPEN" : "COMING SOON",
    price: `$${Number(box.price).toFixed(2)}`,
    tag: box.boxCategory?.name || "MYSTERY",
    star: 5, // Default rating, could be calculated from reviews if available
    image: box.imageUrl || "/box/card-bg.png",
    heroImage: box.backgroundImage || box.imageUrl || "/box/card-bg.png",
    percentage: "85%", // Default percentage, could be calculated from actual odds
    color: box.boxCategory?.color || "#3b82f6",
    experience: 0, // Default experience value
    description: box.description || "",
    shippingInfo: "Free shipping worldwide", // Default shipping info
    href: `/box/${box.id}`,
    rewards: [], // Could be populated from items if needed
    stats: [
      { label: "Purchased", value: box.purchasedCount.toString() },
      { label: "Revenue", value: `$${Number(box.totalRevenue).toFixed(2)}` },
    ],
  };
}

/**
 * Group boxes by category for display
 */
export function groupBoxesByCategory(boxes: Box[], categories: BoxCategory[]): Array<{
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  boxes: MysteryBox[];
}> {
  const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
  
  const grouped = boxes.reduce((acc, box) => {
    const categoryId = box.boxCategoryId;
    const category = categoryMap.get(categoryId);
    
    if (!category) return acc;
    
    if (!acc[categoryId]) {
      acc[categoryId] = {
        id: category.id,
        name: category.name,
        description: category.description || "",
        color: category.color || "#3b82f6",
        order: category.order,
        boxes: [],
      };
    }
    
    acc[categoryId].boxes.push(transformBoxToMysteryBox(box));
    return acc;
  }, {} as Record<string, any>);
  
  return Object.values(grouped).sort((a, b) => a.order - b.order);
}

/**
 * Transform database Item data to BoxReward format for spinner
 */
export function transformItemToBoxReward(item: Item): BoxReward {
  // Map item status to reward tier
  const statusToTier: Record<string, RewardTier> = {
    'MOST_WANTED': 'legendary',
    'WANTED': 'epic',
    'IN_DEMAND': 'rare',
    'UNCOMMON': 'uncommon',
    'COMMON': 'uncommon', // Default uncommon for common items
  };

  return {
    id: item.id,
    name: item.name,
    image: item.imageUrl || "/box/card-bg.png",
    price: item.price ? `$${Number(item.price).toFixed(2)}` : "N/A",
    odds: `${item.percentage}%`,
    tier: statusToTier[item.status] || 'uncommon',
    description: item.description || "",
  };
}

/**
 * Transform multiple items to box rewards
 */
export function transformItemsToBoxRewards(items: Item[]): BoxReward[] {
  return items.map(transformItemToBoxReward);
}

/**
 * Get hot picks boxes (top boxes by purchasedCount)
 */
export function getHotPicksBoxes(boxes: Box[], limit: number = 5): MysteryBox[] {
  return boxes
    .filter(box => box.isActive)
    .sort((a, b) => b.purchasedCount - a.purchasedCount)
    .slice(0, limit)
    .map(transformBoxToMysteryBox);
}
