import { AccountReferrals, AccountSidebar } from "@/components/account";

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-rage text-primary mb-2">🤝 Referrals</h1>
          <p className="text-muted-foreground">Invite friends and earn rewards from their purchases</p>
        </div>

        {/* Account Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AccountReferrals />
          </div>
        </div>
      </div>
    </div>
  );
}
