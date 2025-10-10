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

// Hook for client-side authentication checking
export const useAuth = () => {
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setIsAuth(true);
          setUser(session.data.user);
        } else {
          setIsAuth(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuth(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated: isAuth, user, isLoading: isAuth === null };
};

