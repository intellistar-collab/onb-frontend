"use client";

import { useState } from "react";

export default function AccountReferrals() {
  const [referralData] = useState({
    referralCode: "ALEX2024",
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 240,
    pendingEarnings: 45,
    commissionRate: 10,
    referralLink: "https://onenightbox.com/ref/ALEX2024",
    referrals: [
      {
        id: 1,
        username: "gamer_mike",
        joinDate: "2024-01-15",
        status: "active",
        totalSpent: 150,
        yourEarnings: 15,
        lastActivity: "2 days ago"
      },
      {
        id: 2,
        username: "mystery_lover",
        joinDate: "2024-01-12",
        status: "active",
        totalSpent: 300,
        yourEarnings: 30,
        lastActivity: "1 day ago"
      },
      {
        id: 3,
        username: "box_hunter",
        joinDate: "2024-01-10",
        status: "active",
        totalSpent: 75,
        yourEarnings: 7.5,
        lastActivity: "5 hours ago"
      },
      {
        id: 4,
        username: "lucky_player",
        joinDate: "2024-01-08",
        status: "inactive",
        totalSpent: 25,
        yourEarnings: 2.5,
        lastActivity: "2 weeks ago"
      },
      {
        id: 5,
        username: "treasure_seeker",
        joinDate: "2024-01-05",
        status: "active",
        totalSpent: 200,
        yourEarnings: 20,
        lastActivity: "3 hours ago"
      }
    ],
    tiers: [
      { level: 1, referrals: "0-5", commission: "10%", bonus: "None" },
      { level: 2, referrals: "6-15", commission: "12%", bonus: "50 tokens" },
      { level: 3, referrals: "16-30", commission: "15%", bonus: "100 tokens" },
      { level: 4, referrals: "31+", commission: "20%", bonus: "200 tokens" }
    ]
  });

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getCurrentTier = () => {
    const { totalReferrals } = referralData;
    if (totalReferrals >= 31) return 4;
    if (totalReferrals >= 16) return 3;
    if (totalReferrals >= 6) return 2;
    return 1;
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    return currentTier < 4 ? currentTier + 1 : null;
  };

  const getReferralsToNextTier = () => {
    const { totalReferrals } = referralData;
    if (totalReferrals < 6) return 6 - totalReferrals;
    if (totalReferrals < 16) return 16 - totalReferrals;
    if (totalReferrals < 31) return 31 - totalReferrals;
    return 0;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const referralsNeeded = getReferralsToNextTier();

  return (
    <div className="space-y-6">
      {/* Referral Overview */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">🤝 Referral Program</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{referralData.totalReferrals}</div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{referralData.activeReferrals}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">${referralData.totalEarnings}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">${referralData.pendingEarnings}</div>
            <div className="text-sm text-muted-foreground">Pending Earnings</div>
          </div>
        </div>

        {/* Current Tier Status */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Current Tier: Level {currentTier}</h4>
              <p className="text-sm text-muted-foreground">
                Commission Rate: {referralData.tiers[currentTier - 1].commission}
              </p>
            </div>
            {nextTier && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Next Tier in</div>
                <div className="font-semibold text-primary">{referralsNeeded} referrals</div>
              </div>
            )}
          </div>
          
          {nextTier && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress to Level {nextTier}</span>
                <span>{referralData.totalReferrals}/{referralsNeeded + referralData.totalReferrals}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(referralData.totalReferrals / (referralsNeeded + referralData.totalReferrals)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referral Link & Code */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">📢 Share Your Referral</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Referral Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralData.referralCode}
                readOnly
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
              />
              <button
                onClick={() => copyToClipboard(referralData.referralCode)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Referral Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralData.referralLink}
                readOnly
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
              />
              <button
                onClick={() => copyToClipboard(referralData.referralLink)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                {copied ? "✓" : "🔗"}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
              📱 Share on Twitter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              📘 Share on Facebook
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm">
              💬 Share on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Tier System */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">🏆 Tier System</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {referralData.tiers.map((tier) => (
            <div
              key={tier.level}
              className={`rounded-lg border p-4 ${
                currentTier === tier.level
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background"
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-foreground mb-2">
                  Level {tier.level}
                  {currentTier === tier.level && <span className="ml-2 text-primary">👑</span>}
                </div>
                <div className="text-sm text-muted-foreground mb-2">{tier.referrals} referrals</div>
                <div className="text-primary font-semibold mb-1">{tier.commission}</div>
                <div className="text-xs text-muted-foreground">
                  Bonus: {tier.bonus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral List */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">👥 Your Referrals</h4>
        
        <div className="space-y-3">
          {referralData.referrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  referral.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <div className="font-medium text-foreground">@{referral.username}</div>
                  <div className="text-sm text-muted-foreground">
                    Joined {referral.joinDate} • Last seen {referral.lastActivity}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-foreground">+${referral.yourEarnings}</div>
                <div className="text-sm text-muted-foreground">${referral.totalSpent} spent</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary/80 transition-colors text-sm">
            View All Referrals →
          </button>
        </div>
      </div>
    </div>
  );
}
