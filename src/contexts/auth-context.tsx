"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {authClient} from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { walletScoreAPI } from "@/lib/api/account";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  wallet?: {
    id: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
  score?: {
    id: number;
    score: number;
    source: string;
    createdAt: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  loginWithGoogle: (callbackURL?: string) => Promise<any>;
  signup: (email: string, password: string, name: string) => Promise<any>;
  signupWithGoogle: (callbackURL?: string) => Promise<any>;
  logout: (redirectTo?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  const fetchWalletAndScore = async () => {
    try {
      const walletScoreData = await walletScoreAPI.getWalletAndScore();
      return walletScoreData;
    } catch (error) {
      console.error("Failed to fetch wallet and score:", error);
      return null;
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      console.log("Refreshing user session...");
      
      const session = await authClient.getSession();
      console.log("Session data:", session);
      
      if (session.data?.user) {
        const userData = session.data.user as any;
        console.log("User data found:", userData);
        
        // Fetch wallet and score data in parallel for better performance
        const walletScoreData = await fetchWalletAndScore();
        
        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          username: userData.username || userData.name,
          role: userData.role || "USER",
          avatar: userData.avatar || null,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          wallet: walletScoreData?.wallet,
          score: walletScoreData?.score,
        };
        
        setUser(user);
        
        // Store user data in localStorage for game access
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Failed to store user data in localStorage:', error);
        }
      } else {
        console.log("No user data in session");
        setUser(null);
        // Clear localStorage when no user
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Failed to clear user data from localStorage:', error);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // Don't immediately set user to null on error, might be temporary network issue
      // Only set to null if it's a clear authentication error
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      console.log("Auth context login attempt for:", email);
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      console.log("Auth client result:", result);

      if (result.error) {
        console.error("Auth client error:", result.error);
        throw new Error(result.error.message || "Login failed");
      }

      // Persist token locally to avoid third-party cookie blocking issues
      try {
        const token = (result.data as any)?.session?.token;
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('better-auth.session_token', token as string);
        }
      } catch (error) {
        console.error("Failed to store token:", error);
      }

      console.log("Login successful, refreshing user data...");
      await refreshUser();
      console.log("User data refreshed successfully");
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (callbackURL?: string) => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || `${window.location.origin}/`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Google login failed");
      }

      // Refresh user data after successful login
      await refreshUser();
      return result;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }

      // Refresh user data after successful signup
      await refreshUser();
      return result;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const signupWithGoogle = async (callbackURL?: string) => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || `${window.location.origin}/`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Google signup failed");
      }

      // Refresh user data after successful signup
      await refreshUser();
      return result;
    } catch (error) {
      console.error("Google signup failed:", error);
      throw error;
    }
  };

  const logout = async (redirectTo?: string) => {
    try {
      await authClient.signOut();
      
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('better-auth.session_token');
        localStorage.removeItem('user');
      }
      
      // If redirectTo is provided, use it; otherwise stay on current page
      if (redirectTo) {
        router.push(redirectTo);
      }
      // If no redirect specified, don't navigate - user stays on current page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        
        // First, check if we have a token for immediate feedback
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('better-auth.session_token');
          const cachedUser = localStorage.getItem('user');
          const cacheTime = localStorage.getItem('user_cache_time');
          
          if (cachedUser && cacheTime && token) {
            const cacheAge = Date.now() - parseInt(cacheTime);
            if (cacheAge < 5 * 60 * 1000) { // 5 minutes
              console.log("Using cached user data for fast loading");
              const user = JSON.parse(cachedUser);
              setUser(user);
              setIsLoading(false); // Stop loading immediately with cached data
              
              // Then refresh with fresh data in background
              setTimeout(async () => {
                try {
                  await refreshUser(); // Force refresh
                } catch (error) {
                  console.error("Background auth refresh failed:", error);
                }
              }, 100);
              return;
            }
          }
          
          // If no token, immediately show as not authenticated
          if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
        
        // If we have a token but no cached data, do full auth check
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 8000)
        );
        
        await Promise.race([refreshUser(), timeoutPromise]);
        console.log("Auth initialization completed");
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Don't set user to null on timeout, just stop loading
        if (error instanceof Error && error.message !== 'Auth timeout') {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    loginWithGoogle,
    signup,
    signupWithGoogle,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
