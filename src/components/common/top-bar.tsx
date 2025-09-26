"use client";

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const hiddenPaths = ["/signup", "/login"];

const TopBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "MYSTERY BOXES", href: "/mystery-boxes" },
    { name: "HOW TO PLAY", href: "/how-to-play" },
    { name: "RANKS", href: "ranks" },
  ];

  if(hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav className="text-white sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-18">
          {/* Left Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 font-oswald">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-sm md:text-base lg:text-lg xl:text-xl font-medium transition-colors duration-200",
                  pathname === item.href
                    ? "text-pink-400"
                    : "hover:text-pink-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-gray-800 p-1 sm:p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Image src="/logo.svg" height={150} width={150} alt="logo" />
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 font-oswald">
            {/* Currency Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800 text-xs md:text-sm lg:text-base px-2 lg:px-3"
                >
                  £ GBP
                  <ChevronDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  £ GBP
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  $ USD
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  € EUR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800 text-xs md:text-sm lg:text-base px-2 lg:px-3"
                >
                  EN
                  <ChevronDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="bg-gray-500/40 rounded-md p-1 gap-2">
              <Button variant="ghost" onClick={() => router.push("/login")}>
                SIGN IN
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/signup")}
              >
                SIGN UP
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button Placeholder for Right Side */}
          <div className="md:hidden w-8 sm:w-10"></div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base sm:text-lg font-medium hover:text-pink-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Currency/Language */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 py-1"
                    >
                      £ GBP
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      £ GBP
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      $ USD
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      € EUR
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 py-1"
                    >
                      EN
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      Español
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      Français
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="px-3 py-2 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-gray-800 justify-start text-sm sm:text-base py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN IN
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-sm sm:text-base py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN UP
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;
