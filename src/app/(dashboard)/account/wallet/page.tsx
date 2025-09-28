import { AccountWallet, AccountSidebar } from "@/components/account";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-rage text-primary mb-2">💰 Wallet</h1>
          <p className="text-muted-foreground">Manage your tokens, deposits, and withdrawals</p>
        </div>

        {/* Account Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AccountWallet />
          </div>
        </div>
      </div>
    </div>
  );
}
