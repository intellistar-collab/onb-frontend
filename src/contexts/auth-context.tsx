"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
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
const DEBOUNCE_DELAY = 100; // ms
const REFRESH_DELAY = 100; // ms

// Storage keys
const STORAGE_KEYS = {
  SESSION_TOKEN: 'better-auth.session_token',
  USER_DATA: 'user',
  CACHE_TIME: 'user_cache_time',
} as const;

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

  // Refs for cleanup and debouncing
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Memoized computed values
  const isAuthenticated = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => user?.role === "ADMIN", [user?.role]);

  // Utility functions
  const isClient = useCallback(() => typeof window !== 'undefined', []);

  const clearAuthState = useCallback(() => {
    setUser(null);
    if (isClient()) {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }, [isClient]);

  const storeUserData = useCallback((userData: User) => {
    if (isClient()) {
      try {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.CACHE_TIME, Date.now().toString());
      } catch (error) {
        console.warn("Failed to store user data:", error);
      }
    }
  }, [isClient]);

  const getCachedUser = useCallback((): User | null => {
    if (!isClient()) return null;
    
    try {
      const token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
      const cachedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const cacheTime = localStorage.getItem(STORAGE_KEYS.CACHE_TIME);
      
      if (cachedUser && cacheTime && token) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        if (cacheAge < CACHE_DURATION) {
          return JSON.parse(cachedUser);
        }
      }
    } catch (error) {
      console.warn("Failed to get cached user:", error);
    }
    
    return null;
  }, [isClient]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const currentToken = isClient() ? localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN) : null;
      
      if (!currentToken) {
        console.log("No token found for refresh");
        return false;
      }

      console.log("Attempting to refresh token...");
      const response = await fetch(`${baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${currentToken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.token && isClient()) {
          localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, result.token);
          console.log("Token refreshed successfully");
          return true;
        }
      } else {
        console.log("Token refresh failed with status:", response.status);
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  }, [isClient]);

  const fetchWalletAndScore = useCallback(async () => {
    try {
      console.log("Fetching wallet and score data...");
      return await walletScoreAPI.getWalletAndScore();
    } catch (error) {
      console.log("Wallet and score fetch failed:", error);
      // Try to refresh token and retry once
      if (error instanceof Error && (error.message.includes('Unauthorized') || error.message.includes('401'))) {
        console.log("Attempting token refresh for wallet/score...");
        const refreshed = await refreshToken();
        if (refreshed) {
          try {
            console.log("Retrying wallet and score fetch after refresh...");
            return await walletScoreAPI.getWalletAndScore();
          } catch (retryError) {
            console.error("Failed to fetch wallet and score after refresh:", retryError);
            // If still failing after refresh, clear auth state
            if (isMountedRef.current) {
              clearAuthState();
            }
          }
        } else {
          console.log("Token refresh failed, clearing auth state");
          // If refresh failed, clear auth state
          if (isMountedRef.current) {
            clearAuthState();
          }
        }
      }
      
      return null;
    }
  }, [refreshToken, clearAuthState]);

  const createUserFromData = useCallback(async (userData: any): Promise<User> => {
    let walletScoreData = null;
    
    try {
      walletScoreData = await fetchWalletAndScore();
    } catch (error) {
      console.warn("Failed to fetch wallet and score data:", error);
      // Continue without wallet/score data rather than failing completely
    }
    
    return {
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
  }, [fetchWalletAndScore]);

  // Debounced refresh function
  const refreshUser = useCallback(async (): Promise<void> => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    return new Promise<void>((resolve) => {
      refreshTimeoutRef.current = setTimeout(async () => {
        if (!isMountedRef.current) {
          resolve();
          return;
        }

        try {
          const session = await authClient.getSession();
          
          if (session.data?.user) {
            const userData = await createUserFromData(session.data.user);
            
            if (isMountedRef.current) {
              setUser(userData);
              storeUserData(userData);
            }
          } else {
            if (isMountedRef.current) {
              clearAuthState();
            }
          }
        } catch (error) {
          console.error("Failed to refresh user:", error);
          if (error instanceof Error && (error.message.includes('Unauthorized') || error.message.includes('401'))) {
            // Try to refresh token before clearing auth state
            const refreshed = await refreshToken();
            if (!refreshed && isMountedRef.current) {
              clearAuthState();
            }
          }
        } finally {
          resolve();
        }
      }, DEBOUNCE_DELAY);
    });
  }, [createUserFromData, storeUserData, clearAuthState, refreshToken]);

  // Authentication functions
  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const response = await fetch(`${baseURL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const result = await response.json();

      // Store token securely
      const token = result.session?.token;
      if (isClient() && token) {
        localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
      }

      // Update user state
      if (result.user) {
        const userData = await createUserFromData(result.user);
        setUser(userData);
        storeUserData(userData);
      }

      return result;
    } catch (error) {
      console.error("Login failed:", error);
      clearAuthState();
      throw error;
    }
  }, [isClient, createUserFromData, storeUserData, clearAuthState]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
      const response = await fetch(`${baseURL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Signup failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async (callbackURL?: string) => {
    throw new Error("Google authentication is not yet implemented");
  }, []);

  const signupWithGoogle = useCallback(async (callbackURL?: string) => {
    throw new Error("Google authentication is not yet implemented");
  }, []);

  const logout = useCallback(async (redirectTo?: string) => {
    try {
      setUser(null);
      clearAuthState();
      await authClient.signOut();
      
      // Handle redirect
      if (redirectTo) {
        router.push(redirectTo);
      } else if (isClient()) {
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
      
      // Fallback redirect
      if (redirectTo) {
        router.push(redirectTo);
      } else if (isClient()) {
        const currentPath = window.location.pathname;
        const isOnProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));
        
        if (isOnProtectedRoute) {
          router.push("/");
        }
      }
    }
  }, [router, clearAuthState, isClient]);

  // Initialize auth on mount and when component re-mounts (e.g., after page reload)
  useEffect(() => {
    isMountedRef.current = true;
    
    // Listen for storage changes (e.g., when auth state changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SESSION_TOKEN || e.key === STORAGE_KEYS.USER_DATA) {
        console.log("🔄 Storage change detected, re-initializing auth...");
        initializeAuth();
      }
    };

    // Listen for page visibility changes (e.g., when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && isMountedRef.current) {
        console.log("🔄 Page became visible, checking auth state...");
        // Small delay to ensure any pending auth operations complete
        setTimeout(() => {
          if (isMountedRef.current) {
            refreshUser();
          }
        }, 100);
      }
    };

    const initializeAuth = async () => {
      try {
        console.log("🔄 Initializing auth context...");
        
        // Check for cached user data first
        const cachedUser = getCachedUser();
        if (cachedUser) {
          console.log("📦 Found cached user, setting immediately");
          if (isMountedRef.current) {
            setUser(cachedUser);
            setIsLoading(false);
          }
          
          // Refresh in background
          setTimeout(() => {
            if (isMountedRef.current) {
              console.log("🔄 Refreshing user data in background...");
              refreshUser();
            }
          }, REFRESH_DELAY);
          return;
        }
        
        // Check for token
        if (isClient()) {
          const token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
          if (!token) {
            console.log("❌ No token found, setting user to null");
            if (isMountedRef.current) {
              setUser(null);
              setIsLoading(false);
            }
            return;
          }
          
          console.log("🔑 Token found, attempting to refresh...");
          // Try to refresh token first if we have one
          const refreshed = await refreshToken();
          if (!refreshed) {
            console.log("❌ Token refresh failed, clearing auth state");
            // Token is invalid, clear auth state
            if (isMountedRef.current) {
              clearAuthState();
              setIsLoading(false);
            }
            return;
          }
        }
        
        // Full auth check
        console.log("🔄 Performing full auth check...");
        if (isMountedRef.current) {
          await refreshUser();
        }
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        if (isMountedRef.current) {
          clearAuthState();
        }
      } finally {
        if (isMountedRef.current) {
          console.log("✅ Auth initialization complete");
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    
    // Add event listeners
    if (isClient()) {
      window.addEventListener('storage', handleStorageChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      isMountedRef.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      // Remove event listeners
      if (isClient()) {
        window.removeEventListener('storage', handleStorageChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run on every mount/re-mount

  // Memoized context value
  const value = useMemo<AuthContextType>(() => ({
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
  }), [
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
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};