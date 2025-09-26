import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Account",
  description: "Manage your ONB account settings, profile information, and preferences. Access your account dashboard to update personal details, change passwords, and configure notification settings.",
  keywords: ["account", "profile", "settings", "dashboard", "ONB"],
  openGraph: {
    title: "Account - ONB",
    description: "Manage your ONB account settings and preferences",
    type: "website",
  },
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}