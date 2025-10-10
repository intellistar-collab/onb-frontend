import { AccountCommunity, AccountLayout } from "@/components/account";

export default function CommunityPage() {
  return (
    <AccountLayout
      title="🌟 ONB Community"
      description="Connect with other players, share your wins, and build your reputation"
      icon="🌟"
    >
      <AccountCommunity />
    </AccountLayout>
  );
}
