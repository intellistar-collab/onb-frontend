import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getNavigationItems, type NavigationItem } from "@/constants/navigation";
import CurrencyDropdown from "./currency-dropdown";
import LanguageDropdown from "./language-dropdown";

interface MobileMenuProps {
  isOpen: boolean;
  isClosing: boolean;
  isAdmin: boolean;
  newBoxCount: number;
  onClose: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  isClosing, 
  isAdmin, 
  newBoxCount, 
  onClose 
}: MobileMenuProps) {
  const navItems = getNavigationItems(isAdmin);

  if (!isOpen) return null;

  return (
    <>
      {/* Full Screen Blurred Mask Layer */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/60 transition-all duration-300 ${
          isClosing 
            ? 'animate-out fade-out' 
            : 'animate-in fade-in'
        }`}
        style={{ 
          zIndex: '9998 !important',
          backdropFilter: 'blur(12px)', 
          WebkitBackdropFilter: 'blur(12px)',
          pointerEvents: 'auto',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
        onClick={() => {
          console.log('Backdrop clicked - closing menu');
          onClose();
        }}
      />
      
      {/* Slide-out Menu - positioned above the blurred mask */}
      <div 
        className={`md:hidden fixed left-0 top-0 h-screen w-72 max-w-[80vw] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-r border-gray-600/50 shadow-2xl transform transition-all duration-300 ease-out overflow-hidden ${
          isClosing 
            ? 'animate-out slide-out-to-left' 
            : 'animate-in slide-in-from-left'
        }`}
        style={{ 
          zIndex: '9999 !important',
          pointerEvents: 'auto'
        }}
        onClick={(e) => {
          console.log('Menu clicked - stopping propagation');
          e.stopPropagation();
        }}
      >
        {/* Menu Header */}
        <div className="flex items-center p-4 border-b border-gray-600/50 bg-gradient-to-r from-gray-800/20 to-gray-700/20 flex-shrink-0" style={{ height: '60px' }}>
          <div className="flex items-center gap-2 -mt-1">
            <Image 
              src="/logo.svg" 
              height={32} 
              width={32} 
              alt="logo" 
              className="h-5 w-auto"
              style={{ width: "auto", height: "auto" }}
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
          {/* Navigation Items */}
          <div className="px-4 py-4 space-y-3 overflow-y-auto overflow-x-hidden" style={{ height: 'calc(100vh - 120px)' }}>
            {navItems.map((item: NavigationItem, index: number) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-4 text-base font-medium text-white hover:text-pink-400 hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-700/60 rounded-xl transition-all duration-300 group border border-gray-600/40 hover:border-gray-600/60 shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20"
                  onClick={() => onClose()}
                >
                  <div className="p-2 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-pink-500/20">
                    <item.icon className={`h-5 w-5 group-hover:scale-110 transition-transform duration-300 ${
                      item.name === "HOME" ? "text-blue-400 group-hover:text-blue-300" :
                      item.name === "MYSTERY BOXES" ? "text-yellow-400 group-hover:text-yellow-300" :
                      item.name === "HOW TO PLAY" ? "text-green-400 group-hover:text-green-300" :
                      item.name === "RANKS" ? "text-purple-400 group-hover:text-purple-300" :
                      item.name === "ADMIN" ? "text-red-400 group-hover:text-red-300" :
                      "text-gray-400 group-hover:text-gray-300"
                    }`} />
                  </div>
                  <span className="flex-1 group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  {item.name === "MYSTERY BOXES" && (
                    <span className="relative inline-flex items-center">
                      <span className="relative z-10 inline-flex items-center justify-center min-w-[22px] h-[22px] px-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-extrabold leading-none ring-2 ring-yellow-300 shadow-lg shadow-yellow-500/30 animate-bounce group-hover:scale-110 transition-transform duration-300">
                        {newBoxCount > 99 ? '99+' : newBoxCount}
                      </span>
                      <span className="pointer-events-none absolute -inset-1 rounded-full bg-yellow-400/40 animate-ping" />
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-600/50 p-3 bg-gradient-to-r from-gray-800/30 to-gray-700/30 flex-shrink-0">
            {/* Currency/Language */}
            <div className="flex items-center justify-between">
              <CurrencyDropdown variant="mobile" />
              <LanguageDropdown variant="mobile" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
