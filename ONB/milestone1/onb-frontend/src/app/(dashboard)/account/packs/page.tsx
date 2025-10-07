import { AccountPacks, AccountLayout } from "@/components/account";

export default function PacksPage() {
  return (
    <AccountLayout
      title="📦 Packs"
      description="View your items, experiences, and tokens from mystery boxes"
      icon="📦"
    >
      <AccountPacks />
    </AccountLayout>
  );
}
