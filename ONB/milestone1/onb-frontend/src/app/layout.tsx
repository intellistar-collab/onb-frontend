import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import localFont from "next/font/local";
import TopBar from "@/components/common/top-bar";
import ExperienceBanner from "@/components/common/experience-banner";
import Footer from "@/components/common/footer";
import FloatingUsersSidebar from "@/components/common/floating-users-sidebar";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

const rage = localFont({
  src: "./rage.ttf",
  variable: "--font-rage",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const pricedown = localFont({
  src: "./pricedown.otf",
  variable: "--font-pricedown",
});

const suisseIntl = localFont({
  src: "./suisse-intl.ttf",
  variable: "--font-suisseintl",
});

export const metadata: Metadata = {
  title: "ONB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rage.variable} ${oswald.variable} ${pricedown.variable} ${suisseIntl.variable} antialiased`}
      >
        <TopBar />
        <ExperienceBanner />
        <ToastProvider>
          {children}
        </ToastProvider>
        <Footer />
        <FloatingUsersSidebar />
      </body>
    </html>
  );
}
