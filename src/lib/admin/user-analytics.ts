import { User } from "@/lib/api/users";

export const calculateReferralAnalytics = (usersData: User[]) => {
  const referralSources: { [key: string]: { count: number; revenue: number } } = {};
  const affiliateCodes: { [key: string]: { count: number; revenue: number } } = {};
  
  let totalReferrals = 0;
  let totalRevenue = 0;
  
  usersData.forEach(user => {
    if (user.referralSource) {
      totalReferrals++;
      if (!referralSources[user.referralSource]) {
        referralSources[user.referralSource] = { count: 0, revenue: 0 };
      }
      referralSources[user.referralSource].count++;
      referralSources[user.referralSource].revenue += user.wallet?.balance || 0;
      totalRevenue += user.wallet?.balance || 0;
    }
    
    if (user.affiliateCode) {
      if (!affiliateCodes[user.affiliateCode]) {
        affiliateCodes[user.affiliateCode] = { count: 0, revenue: 0 };
      }
      affiliateCodes[user.affiliateCode].count++;
      affiliateCodes[user.affiliateCode].revenue += user.wallet?.balance || 0;
    }
  });

  const topSources = Object.entries(referralSources)
    .map(([source, data]) => ({
      source,
      count: data.count,
      revenue: data.revenue,
      conversionRate: (data.count / usersData.length) * 100,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const topAffiliates = Object.entries(affiliateCodes)
    .map(([code, data]) => ({
      code,
      count: data.count,
      revenue: data.revenue,
      commission: data.revenue * 0.1, // 10% commission
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    topSources,
    topAffiliates,
    totalReferrals,
    totalRevenue,
    averageConversionRate: totalReferrals > 0 ? (totalReferrals / usersData.length) * 100 : 0,
  };
};

export const calculateUserStats = (users: User[]) => {
  return [
    {
      label: "Total Users",
      value: users.length,
      icon: "Users",
      color: "blue",
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "ACTIVE").length,
      icon: "CheckCircle",
      color: "green",
    },
    {
      label: "Pending Users",
      value: users.filter((u) => u.status === "PENDING").length,
      icon: "Clock",
      color: "yellow",
    },
    {
      label: "Disabled Users",
      value: users.filter((u) => u.status === "DISABLED").length,
      icon: "UserX",
      color: "red",
    },
  ];
};
