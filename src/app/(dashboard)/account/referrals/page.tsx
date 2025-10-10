import { AccountReferrals, AccountLayout } from "@/components/account";

export default function ReferralsPage() {
  return (
    <AccountLayout
      title="🤝 Referrals"
      description="Invite friends and earn rewards from their purchases"
      icon="🤝"
    >
      <AccountReferrals />
    </AccountLayout>
  );
}
