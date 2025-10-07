import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | FAQ",
  description: "Find answers to frequently asked questions about ONB. Get help with common issues, learn about features, troubleshoot problems, and find solutions to enhance your gaming experience.",
  keywords: ["faq", "frequently asked questions", "help", "support", "troubleshoot", "ONB"],
  openGraph: {
    title: "FAQ - ONB",
    description: "Frequently asked questions about ONB",
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