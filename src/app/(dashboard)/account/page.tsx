"use client";

import { AccountProfile, AccountStats, AccountSettings, AccountLayout } from "@/components/account";

export default function AccountPage() {
  return (
    <AccountLayout
      title="My Account"
      description="Manage your profile, settings, and view your statistics"
      icon="👤"
    >
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Profile and Stats */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <div className="space-y-6">
            <AccountProfile />
            <AccountStats />
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="flex-1 min-w-0">
          <AccountSettings />
        </div>
      </div>
    </AccountLayout>
  );
}
