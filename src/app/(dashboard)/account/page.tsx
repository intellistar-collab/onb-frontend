import { AccountProfile, AccountStats, AccountSettings, AccountSidebar } from "@/components/account";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />
      
      <div className="relative">
        {/* Page Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-3xl font-rage text-foreground">My Account</h1>
                <p className="text-sm text-muted-foreground">Manage your profile, settings, and view your statistics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Hidden on mobile, shows as mini on desktop */}
            <div className="hidden lg:block flex-shrink-0">
              <AccountSidebar />
            </div>

            {/* Mobile Navigation - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4">
                <h3 className="font-semibold text-foreground mb-3">Quick Navigation</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <a href="/account" className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium whitespace-nowrap">
                    <span>👤</span> Account
                  </a>
                  <a href="/account/wallet" className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
                    <span>💳</span> Wallet
                  </a>
                  <a href="/account/packs" className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
                    <span>📦</span> Packs
                  </a>
                  <a href="/account/referrals" className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
                    <span>👥</span> Referrals
                  </a>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
