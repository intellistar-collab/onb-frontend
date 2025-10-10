import { AccountWallet, AccountLayout } from "@/components/account";

export default function WalletPage() {
  return (
    <AccountLayout
      title="💰 Wallet"
      description="Manage your tokens, deposits, and withdrawals"
      icon="💰"
    >
      <AccountWallet />
    </AccountLayout>
  );
}
