import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Privacy Policy",
  description: "Read ONB's privacy policy to understand how we collect, use, and protect your personal information. Learn about data security, user privacy rights, and our commitment to protecting your information.",
  keywords: ["privacy", "policy", "data protection", "security", "personal information", "ONB"],
  openGraph: {
    title: "Privacy Policy - ONB",
    description: "ONB privacy policy",
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