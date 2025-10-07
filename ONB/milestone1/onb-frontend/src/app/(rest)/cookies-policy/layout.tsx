import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Cookies Policy",
  description: "Learn about how ONB uses cookies and similar technologies. Understand our cookie policy, data collection practices, and how we use cookies to improve your experience on our platform.",
  keywords: ["cookies", "privacy", "data collection", "tracking", "policy", "ONB"],
  openGraph: {
    title: "Cookies Policy - ONB",
    description: "ONB cookies policy",
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