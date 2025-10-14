"use client";

import { useState } from "react";
import AccountProfile from "@/components/account/account-profile";
import AccountSecurity from "@/components/account/account-security";
import AccountWallet from "@/components/account/account-wallet";
import AccountPreferences from "@/components/account/account-preferences";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "wallet", label: "Wallet", icon: "💰" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <AccountProfile />;
      case "security":
        return <AccountSecurity />;
      case "wallet":
        return <AccountWallet />;
      case "preferences":
        return <AccountPreferences />;
      default:
        return <AccountProfile />;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
