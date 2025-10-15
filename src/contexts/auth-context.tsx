"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { walletScoreAPI } from "@/lib/api/account";
import { createAuthClient, type RequestContext } from "better-auth/client";
import { usernameClient, adminClient } from "better-auth/client/plugins";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// Define auth client directly in the context
const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  user: {},
  fetchOptions: {
    timeout: 8000, // Reduced timeout for faster failure detection
    onRequest: (context: RequestContext) => {
      console.log("📡 Auth request to:", context.url);
      context.credentials = "include";
      context.headers.set("Content-Type", "application/json");
      context.headers.set("Accept", "application/json");
      // Add Authorization header from stored token when available
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('better-auth.session_token');
          if (token) {
            context.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      } catch (_e) {}
    },
    onError: (error) => {
      console.error("❌ Auth request error:", error);
    },
  },
  plugins: [usernameClient(), adminClient()],
  // Performance optimizations
  session: {
    updateAge: 24 * 60 * 60, // 24 hours - reduce session update frequency
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  },
  // Enable caching for better performance
  cache: {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5 minutes cache
  },
});

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
  logout: () => Promise<void>;
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

  const refreshUser = useCallback(async (forceRefresh = false) => {
    try {
      console.log("Refreshing user session...");
      
      // Check if we have cached user data and it's recent (within 5 minutes)
      if (!forceRefresh && typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('user');
        const cacheTime = localStorage.getItem('user_cache_time');
        
        if (cachedUser && cacheTime) {
          const cacheAge = Date.now() - parseInt(cacheTime);
          if (cacheAge < 5 * 60 * 1000) { // 5 minutes
            console.log("Using cached user data");
            const user = JSON.parse(cachedUser);
            setUser(user);
            return;
          }
        }
      }
      
      const session = await authClient.getSession();
      console.log("Session data:", session);
      
      if (session.data?.user) {
        const userData = session.data.user as any;
        console.log("User data found:", userData);
        
        // Fetch wallet and score data in parallel for better performance
        const [walletScoreData] = await Promise.allSettled([
          fetchWalletAndScore()
        ]);
        
        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          username: userData.username || userData.name,
          role: userData.role || "USER",
          avatar: userData.avatar || null,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          wallet: walletScoreData.status === 'fulfilled' ? walletScoreData.value?.wallet : undefined,
          score: walletScoreData.status === 'fulfilled' ? walletScoreData.value?.score : undefined,
        };
        
        setUser(user);
        
        // Store user data in localStorage with cache timestamp
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('user_cache_time', Date.now().toString());
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
            localStorage.removeItem('user_cache_time');
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
      console.log("Attempting login...");
      
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        throw new Error(result.error.message || "Login failed");
      }

      console.log("Login successful:", result);

      // Persist token locally to avoid third-party cookie blocking issues
      try {
        const token = (result.data as any)?.session?.token;
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('better-auth.session_token', token);
          console.log("Token stored in localStorage");
        }
      } catch (error) {
        console.error("Failed to store token:", error);
      }

      // Refresh user data after successful login (force refresh to get latest data)
      await refreshUser(true);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (callbackURL?: string) => {
    try {
      console.log("Attempting Google login...");
      
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || `${window.location.origin}/`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Google login failed");
      }

      console.log("Google login successful:", result);

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
      console.log("Attempting signup...");
      
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }

      console.log("Signup successful:", result);

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
      console.log("Attempting Google signup...");
      
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || `${window.location.origin}/`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Google signup failed");
      }

      console.log("Google signup successful:", result);

      // Refresh user data after successful signup
      await refreshUser();
      return result;
    } catch (error) {
      console.error("Google signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");
      
      await authClient.signOut();
      
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('better-auth.session_token');
        localStorage.removeItem('user');
      }
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if server logout fails
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('better-auth.session_token');
        localStorage.removeItem('user');
      }
      router.push("/");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        // Add a timeout to prevent hanging on slow network
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
