import { AccountPacks, AccountSidebar } from "@/components/account";

export default function PacksPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-rage text-primary mb-2">📦 Packs</h1>
          <p className="text-muted-foreground">View your items, experiences, and tokens from mystery boxes</p>
        </div>

        {/* Account Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AccountPacks />
          </div>
        </div>
      </div>
    </div>
  );
}
