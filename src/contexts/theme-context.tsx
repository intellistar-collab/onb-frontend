"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration and load theme preference
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage and document after hydration
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('admin-theme');
      const shouldBeDark = savedTheme === 'dark';
      setIsDarkMode(shouldBeDark);
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
      // Also set the dark class for Tailwind's dark: prefix
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Save theme preference to localStorage and apply to document
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-theme', newTheme ? 'dark' : 'light');
    }
    
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    // Also set the dark class for Tailwind's dark: prefix
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value: ThemeContextType = {
    isDarkMode: mounted ? isDarkMode : false, // Prevent hydration mismatch
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
