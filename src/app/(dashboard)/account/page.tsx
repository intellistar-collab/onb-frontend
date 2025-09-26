import { AccountProfile, AccountStats, AccountSettings } from "@/components/account";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-rage text-primary mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile, settings, and view your statistics</p>
        </div>

        {/* Account Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile and Stats */}
          <div className="lg:col-span-1 space-y-6">
            <AccountProfile />
            <AccountStats />
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2">
            <AccountSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
