import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Signup",
  description: "Create your ONB account to join our gaming community. Register with your email address to get started with playing games, tracking scores, and connecting with other players.",
  keywords: ["signup", "register", "create account", "join", "ONB"],
  openGraph: {
    title: "Signup - ONB",
    description: "Create your ONB account",
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