import { Home, Package, HelpCircle, Trophy, Settings } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const getNavigationItems = (isAdmin: boolean = false): NavigationItem[] => [
  { name: "HOME", href: "/", icon: Home },
  { name: "MYSTERY BOXES", href: "/box", icon: Package },
  { name: "HOW TO PLAY", href: "/how-to-play", icon: HelpCircle },
  { name: "RANKS", href: "/ranks", icon: Trophy },
  ...(isAdmin ? [{ name: "ADMIN", href: "/admin/dashboard", icon: Settings }] : []),
];

export const hiddenPaths = ["/signup", "/login"];

export const currencyOptions = [
  { code: "GBP", symbol: "£", label: "£ GBP" },
  { code: "USD", symbol: "$", label: "$ USD" },
  { code: "EUR", symbol: "€", label: "€ EUR" },
];

export const languageOptions = [
  { code: "EN", flag: "🇬🇧", label: "English" },
  { code: "ES", flag: "🇪🇸", label: "Español" },
  { code: "FR", flag: "🇫🇷", label: "Français" },
];
