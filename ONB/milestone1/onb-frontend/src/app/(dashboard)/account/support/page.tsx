import { AccountSupport, AccountLayout } from "@/components/account";

export default function SupportPage() {
  return (
    <AccountLayout
      title="🛟 Support"
      description="Get help with your account, report issues, or contact our team"
      icon="🛟"
    >
      <AccountSupport />
    </AccountLayout>
  );
}
