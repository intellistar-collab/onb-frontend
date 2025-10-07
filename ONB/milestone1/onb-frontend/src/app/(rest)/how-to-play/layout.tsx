import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | How to Play",
  description: "Learn how to play ONB games with our comprehensive guide. Discover game rules, strategies, tips, and tutorials to improve your gameplay experience and maximize your scores.",
  keywords: ["how to play", "tutorial", "guide", "rules", "instructions", "ONB"],
  openGraph: {
    title: "How to Play - ONB",
    description: "Learn how to play ONB games",
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