"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
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

  const refreshUser = async () => {
    try {
      const session = await authClient.getSession();
      if (session.data?.user) {
        const userData = session.data.user as any;
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          username: userData.username || userData.name,
          role: userData.role || "USER",
          avatar: userData.image || userData.avatar || null,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        throw new Error(result.error.message || "Login failed");
      }

      // Refresh user data after successful login
      await refreshUser();
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

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Add a timeout to prevent hanging on slow network
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 3000)
        );
        
        await Promise.race([refreshUser(), timeoutPromise]);
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
  }, []);

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
