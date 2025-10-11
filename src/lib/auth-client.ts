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

