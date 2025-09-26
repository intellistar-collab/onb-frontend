import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Terms and Conditions",
  description: "Read the official terms and conditions for using ONB services. Understand our policies, user agreements, terms of service, and legal requirements for accessing our platform.",
  keywords: ["terms", "conditions", "terms of service", "legal", "agreement", "ONB"],
  openGraph: {
    title: "Terms and Conditions - ONB",
    description: "ONB terms and conditions",
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