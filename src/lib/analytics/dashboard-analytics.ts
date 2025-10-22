import { formatPrice } from "@/lib/utils";
import { User } from "@/lib/api/users";
import { Box } from "@/lib/api/boxes";

export interface Transaction {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  createdAt: string;
  walletId: string;
}

export interface InventoryItem {
  id: string;
  status: 'KEPT' | 'SOLD';
  itemPrice: number;
  createdAt: string;
}

export interface DashboardAnalytics {
  // User Analytics
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  deactivatedUsers: number;
  deletedUsers: number;
  
  // Box Analytics
  totalBoxesOpened: number;
  boxesOpenedToday: number;
  boxesOpenedThisWeek: number;
  boxesOpenedThisMonth: number;
  
  // Session Analytics
  activeSessions: number;
  concurrentUsers: number;
  
  // Financial Analytics
  averageSpendPerUser: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  
  // Prize Analytics
  totalPrizesWon: number;
  totalPrizesExchanged: number;
  exchangeFeeRevenue: number;
  
  // Profit Analytics
  totalProfit: number;
  profitToday: number;
  profitThisWeek: number;
  profitThisMonth: number;
  profitMargin: number;
  
  // Alerts
  pendingWithdrawals: number;
  lowStockAlerts: number;
  systemAlerts: string[];
}

export class DashboardAnalyticsService {
  private static getDateRanges() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    return { now, today, weekAgo, monthAgo };
  }

  static calculateUserAnalytics(users: User[]): {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    deactivatedUsers: number;
    deletedUsers: number;
  } {
    const { today, weekAgo, monthAgo } = this.getDateRanges();
    
    const totalUsers = users.length;
    const newUsersToday = users.filter(user => 
      new Date(user.createdAt) >= today
    ).length;
    const newUsersThisWeek = users.filter(user => 
      new Date(user.createdAt) >= weekAgo
    ).length;
    const newUsersThisMonth = users.filter(user => 
      new Date(user.createdAt) >= monthAgo
    ).length;
    const deactivatedUsers = users.filter(user => 
      user.status === 'DISABLED'
    ).length;
    // Note: deletedAt property doesn't exist in current User interface
    // This would need to be implemented in the backend to track soft deletes
    const deletedUsers = 0; // Mock data for now

    return {
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      deactivatedUsers,
      deletedUsers,
    };
  }

  static calculateBoxAnalytics(boxes: Box[]): {
    totalBoxesOpened: number;
    boxesOpenedToday: number;
    boxesOpenedThisWeek: number;
    boxesOpenedThisMonth: number;
  } {
    const { today, weekAgo, monthAgo } = this.getDateRanges();
    
    const totalBoxesOpened = boxes.reduce((sum, box) => sum + box.purchasedCount, 0);
    
    // For now, we'll estimate based on creation dates
    // In a real app, you'd have actual opening timestamps
    const boxesOpenedToday = boxes.filter(box => 
      new Date(box.createdAt) >= today
    ).reduce((sum, box) => sum + Math.floor(box.purchasedCount * 0.1), 0);
    
    const boxesOpenedThisWeek = boxes.filter(box => 
      new Date(box.createdAt) >= weekAgo
    ).reduce((sum, box) => sum + Math.floor(box.purchasedCount * 0.3), 0);
    
    const boxesOpenedThisMonth = boxes.filter(box => 
      new Date(box.createdAt) >= monthAgo
    ).reduce((sum, box) => sum + Math.floor(box.purchasedCount * 0.7), 0);

    return {
      totalBoxesOpened,
      boxesOpenedToday,
      boxesOpenedThisWeek,
      boxesOpenedThisMonth,
    };
  }

  static calculateFinancialAnalytics(
    users: User[],
    boxes: Box[],
    transactions: Transaction[],
    inventoryItems: InventoryItem[]
  ): {
    averageSpendPerUser: number;
    totalRevenue: number;
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
    totalPrizesWon: number;
    totalPrizesExchanged: number;
    exchangeFeeRevenue: number;
    totalProfit: number;
    profitToday: number;
    profitThisWeek: number;
    profitThisMonth: number;
    profitMargin: number;
  } {
    const { today, weekAgo, monthAgo } = this.getDateRanges();
    
    // Calculate revenue from box sales
    const totalRevenue = boxes.reduce((sum, box) => {
      const revenue = typeof box.totalRevenue === 'number' ? box.totalRevenue : Number(box.totalRevenue) || 0;
      return sum + revenue;
    }, 0);
    
    // Calculate revenue by time periods (estimated)
    const revenueToday = totalRevenue * 0.1;
    const revenueThisWeek = totalRevenue * 0.3;
    const revenueThisMonth = totalRevenue * 0.7;
    
    // Calculate average spend per user
    const averageSpendPerUser = users.length > 0 ? totalRevenue / users.length : 0;
    
    // Calculate prize analytics
    const totalPrizesWon = inventoryItems.length;
    const totalPrizesExchanged = inventoryItems.filter(item => item.status === 'SOLD').length;
    const exchangeFeeRevenue = totalPrizesExchanged * 0.2; // 20% exchange fee
    
    // Calculate profit (revenue - prize costs - exchange fees)
    const totalPrizeCosts = inventoryItems.reduce((sum, item) => sum + item.itemPrice, 0);
    const totalProfit = totalRevenue - totalPrizeCosts + exchangeFeeRevenue;
    
    const profitToday = totalProfit * 0.1;
    const profitThisWeek = totalProfit * 0.3;
    const profitThisMonth = totalProfit * 0.7;
    
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      averageSpendPerUser,
      totalRevenue,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      totalPrizesWon,
      totalPrizesExchanged,
      exchangeFeeRevenue,
      totalProfit,
      profitToday,
      profitThisWeek,
      profitThisMonth,
      profitMargin,
    };
  }

  static calculateSessionAnalytics(): {
    activeSessions: number;
    concurrentUsers: number;
  } {
    // Mock data for now - in a real app, you'd track actual sessions
    const activeSessions = Math.floor(Math.random() * 50) + 20;
    const concurrentUsers = Math.floor(Math.random() * 30) + 15;
    
    return { activeSessions, concurrentUsers };
  }

  static generateAlerts(
    users: User[],
    boxes: Box[],
    inventoryItems: InventoryItem[]
  ): {
    pendingWithdrawals: number;
    lowStockAlerts: number;
    systemAlerts: string[];
  } {
    const pendingWithdrawals = Math.floor(Math.random() * 5); // Mock data
    const lowStockAlerts = boxes.filter(box => box.purchasedCount > 100).length;
    
    const systemAlerts: string[] = [];
    
    if (pendingWithdrawals > 0) {
      systemAlerts.push(`${pendingWithdrawals} pending withdrawal requests`);
    }
    
    if (lowStockAlerts > 0) {
      systemAlerts.push(`${lowStockAlerts} boxes with high demand`);
    }
    
    const deactivatedUsers = users.filter(user => user.status === 'DISABLED').length;
    if (deactivatedUsers > 10) {
      systemAlerts.push(`${deactivatedUsers} users deactivated`);
    }

    return {
      pendingWithdrawals,
      lowStockAlerts,
      systemAlerts,
    };
  }

  static async getDashboardAnalytics(
    users: User[],
    boxes: Box[],
    transactions: Transaction[] = [],
    inventoryItems: InventoryItem[] = []
  ): Promise<DashboardAnalytics> {
    const userAnalytics = this.calculateUserAnalytics(users);
    const boxAnalytics = this.calculateBoxAnalytics(boxes);
    const financialAnalytics = this.calculateFinancialAnalytics(users, boxes, transactions, inventoryItems);
    const sessionAnalytics = this.calculateSessionAnalytics();
    const alerts = this.generateAlerts(users, boxes, inventoryItems);

    return {
      ...userAnalytics,
      ...boxAnalytics,
      ...financialAnalytics,
      ...sessionAnalytics,
      ...alerts,
    };
  }
}
