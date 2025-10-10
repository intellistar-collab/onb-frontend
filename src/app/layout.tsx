import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/auth-context";
import ConditionalLayout from "@/components/common/conditional-layout";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rage.variable} ${oswald.variable} ${pricedown.variable} ${suisseIntl.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
