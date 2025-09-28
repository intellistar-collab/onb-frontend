"use client";

import { useState } from "react";
import Image from "next/image";

export default function AccountPacks() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [packs] = useState({
    items: [
      {
        id: 1,
        name: "Premium Gaming Headset",
        type: "physical",
        value: 150,
        rarity: "rare",
        dateWon: "2024-01-15",
        boxName: "Tech Gadgets Box",
        status: "shipped",
        image: "/public/box/box-item/box0.webp",
        description: "High-quality wireless gaming headset with noise cancellation"
      },
      {
        id: 2,
        name: "Weekend Spa Getaway",
        type: "experience",
        value: 300,
        rarity: "epic",
        dateWon: "2024-01-12",
        boxName: "Luxury Experience Box",
        status: "available",
        image: "/public/box/box-item/box1.webp",
        description: "2-day luxury spa retreat for two people"
      },
      {
        id: 3,
        name: "50 Bonus Tokens",
        type: "tokens",
        value: 50,
        rarity: "common",
        dateWon: "2024-01-10",
        boxName: "Daily Bonus Box",
        status: "claimed",
        image: "/public/box/box-item/box2.webp",
        description: "Extra tokens for your next mystery box purchase"
      },
      {
        id: 4,
        name: "Vintage Watch Collection",
        type: "physical",
        value: 500,
        rarity: "legendary",
        dateWon: "2024-01-08",
        boxName: "Collector's Premium Box",
        status: "pending",
        image: "/public/box/box-item/box3.webp",
        description: "Limited edition vintage watch from 1960s"
      },
      {
        id: 5,
        name: "Concert VIP Tickets",
        type: "experience",
        value: 200,
        rarity: "epic",
        dateWon: "2024-01-05",
        boxName: "Entertainment Box",
        status: "expired",
        image: "/public/box/box-item/box4.webp",
        description: "VIP tickets to see your favorite artist live"
      },
      {
        id: 6,
        name: "Gaming Keyboard RGB",
        type: "physical",
        value: 120,
        rarity: "rare",
        dateWon: "2024-01-03",
        boxName: "Gaming Gear Box",
        status: "delivered",
        image: "/public/box/box-item/box5.webp",
        description: "Mechanical RGB gaming keyboard with custom switches"
      }
    ],
    stats: {
      totalItems: 42,
      totalValue: 2840,
      physicalItems: 18,
      experiences: 12,
      tokens: 12,
      pendingClaims: 3
    }
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-500 border-gray-500/20 bg-gray-500/10";
      case "rare": return "text-blue-500 border-blue-500/20 bg-blue-500/10";
      case "epic": return "text-purple-500 border-purple-500/20 bg-purple-500/10";
      case "legendary": return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
      default: return "text-muted-foreground border-border bg-muted/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "text-green-500 bg-green-500/10";
      case "claimed": return "text-blue-500 bg-blue-500/10";
      case "shipped": return "text-yellow-500 bg-yellow-500/10";
      case "delivered": return "text-green-600 bg-green-600/10";
      case "pending": return "text-orange-500 bg-orange-500/10";
      case "expired": return "text-red-500 bg-red-500/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "physical": return "📦";
      case "experience": return "🎯";
      case "tokens": return "💰";
      default: return "🎁";
    }
  };

  const filteredItems = packs.items.filter(item => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  const filters = [
    { id: "all", label: "All Items", count: packs.items.length },
    { id: "physical", label: "Physical", count: packs.items.filter(i => i.type === "physical").length },
    { id: "experience", label: "Experiences", count: packs.items.filter(i => i.type === "experience").length },
    { id: "tokens", label: "Tokens", count: packs.items.filter(i => i.type === "tokens").length }
  ];

  return (
    <div className="space-y-6">
      {/* Pack Stats Overview */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">📦 Your Pack Collection</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{packs.stats.totalItems}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">${packs.stats.totalValue}</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{packs.stats.physicalItems}</div>
            <div className="text-sm text-muted-foreground">Physical Items</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{packs.stats.experiences}</div>
            <div className="text-sm text-muted-foreground">Experiences</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              {/* Item Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <div className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
              </div>

              {/* Item Image Placeholder */}
              <div className="w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">{getTypeIcon(item.type)}</span>
              </div>

              {/* Item Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-semibold text-primary">
                    {item.type === 'tokens' ? `${item.value} tokens` : `$${item.value}`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Won:</span>
                  <span className="text-foreground">{item.dateWon}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  From: {item.boxName}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {item.status === "available" && (
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors text-sm">
                    Claim Item
                  </button>
                )}
                {item.status === "shipped" && (
                  <button className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm">
                    Track Package
                  </button>
                )}
                {item.status === "pending" && (
                  <button className="w-full bg-muted text-muted-foreground py-2 rounded-md cursor-not-allowed text-sm" disabled>
                    Processing...
                  </button>
                )}
                {item.status === "claimed" && (
                  <button className="w-full bg-green-500 text-white py-2 rounded-md cursor-not-allowed text-sm" disabled>
                    ✓ Claimed
                  </button>
                )}
                {item.status === "delivered" && (
                  <button className="w-full bg-green-600 text-white py-2 rounded-md cursor-not-allowed text-sm" disabled>
                    ✓ Delivered
                  </button>
                )}
                {item.status === "expired" && (
                  <button className="w-full bg-red-500 text-white py-2 rounded-md cursor-not-allowed text-sm" disabled>
                    ⚠ Expired
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h4 className="text-lg font-semibold text-foreground mb-2">No items found</h4>
            <p className="text-muted-foreground">Try a different filter or open some mystery boxes to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
