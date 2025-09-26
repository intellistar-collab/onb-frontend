import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Login",
  description: "Sign in to your ONB account to access your dashboard, play games, and manage your profile. Secure login with email and password authentication.",
  keywords: ["login", "signin", "authentication", "account", "ONB"],
  openGraph: {
    title: "Login - ONB",
    description: "Sign in to your ONB account",
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
