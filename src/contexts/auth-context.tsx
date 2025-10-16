"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { walletScoreAPI } from "@/lib/api/account";

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PROTECTED_ROUTES = ['/account', '/admin'];

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  // Helper functions
  const clearAuthState = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('better-auth.session_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_cache_time');
    }
  }, []);

  const storeUserData = useCallback((userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_cache_time', Date.now().toString());
    }
  }, []);

  const fetchWalletAndScore = useCallback(async () => {
    try {
      return await walletScoreAPI.getWalletAndScore();
    } catch (error) {
      console.error("Failed to fetch wallet and score:", error);
      return null;
    }
  }, []);

  // Main auth functions
  const refreshUser = useCallback(async () => {
    try {
      const session = await authClient.getSession();
      
      if (session.data?.user) {
        const userData = session.data.user as any;
        const walletScoreData = await fetchWalletAndScore();
        
        const user = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          username: userData.username || "",
          role: userData.role || "USER",
          avatar: userData.avatar || null,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          wallet: walletScoreData?.wallet,
          score: walletScoreData?.score,
        };
        
        setUser(user);
        storeUserData(user);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      if (error instanceof Error && (error.message.includes('Unauthorized') || error.message.includes('401'))) {
        clearAuthState();
      }
    }
  }, [fetchWalletAndScore, storeUserData, clearAuthState]);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        throw new Error(result.error.message || "Login failed");
      }

      // Store token
      const token = (result.data as any)?.session?.token;
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('better-auth.session_token', token as string);
      }

      await refreshUser();
      await new Promise(resolve => setTimeout(resolve, 100)); // Smooth transition
      
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      clearAuthState();
      throw error;
    }
  }, [refreshUser, clearAuthState]);

  const loginWithGoogle = useCallback(async (callbackURL?: string) => {
    throw new Error("Google authentication is not yet implemented");
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }

      return result;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }, []);

  const signupWithGoogle = useCallback(async (callbackURL?: string) => {
    throw new Error("Google authentication is not yet implemented");
  }, []);

  const logout = useCallback(async (redirectTo?: string) => {
    try {
      setUser(null);
      clearAuthState();
      await authClient.signOut();
      
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        const currentPath = window.location.pathname;
        const isOnProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));
        
        if (isOnProtectedRoute) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      clearAuthState();
      
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        const currentPath = window.location.pathname;
        const isOnProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));
        
        if (isOnProtectedRoute) {
          router.push("/");
        }
      }
    }
  }, [router, clearAuthState]);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for cached user data first
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('better-auth.session_token');
          const cachedUser = localStorage.getItem('user');
          const cacheTime = localStorage.getItem('user_cache_time');
          
          if (cachedUser && cacheTime && token) {
            const cacheAge = Date.now() - parseInt(cacheTime);
            if (cacheAge < CACHE_DURATION) {
              const user = JSON.parse(cachedUser);
              setUser(user);
              setIsLoading(false);
              
              // Refresh in background
              setTimeout(refreshUser, 100);
              return;
            }
          }
          
          // No token = not authenticated
          if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
        
        // Full auth check
        await refreshUser();
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser, clearAuthState]);

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