import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONB | Contact Us",
  description: "Get in touch with the ONB support team. We're here to help with any questions, feedback, or technical issues you may have. Find our contact information and submit inquiries.",
  keywords: ["contact", "support", "help", "customer service", "ONB"],
  openGraph: {
    title: "Contact Us - ONB",
    description: "Contact ONB support team",
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