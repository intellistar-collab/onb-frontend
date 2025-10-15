import React from "react"
import { createAuthClient, type RequestContext } from "better-auth/client"
import { usernameClient, adminClient } from "better-auth/client/plugins"

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL,
  user: {},
  fetchOptions: {
    onRequest: (context: RequestContext) => {
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
  },
  plugins: [usernameClient(), adminClient()],
});

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await authClient.getSession();
    return !!session.data?.user;
  } catch (error) {
    return false;
  }
};

// Note: useAuth hook is defined in contexts/auth-context.tsx