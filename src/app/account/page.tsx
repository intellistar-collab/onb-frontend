"use client";

import { AccountOverview, AccountSettings, AccountLayout } from "@/components/account";
import { ProtectedRoute } from "@/components/auth/auth-guard";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountLayout>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
          {/* Left Column - Merged Profile with Stats (1/3 width) */}
          <AccountOverview />
          
          {/* Right Column - Settings (2/3 width) */}
          <AccountSettings />
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}
