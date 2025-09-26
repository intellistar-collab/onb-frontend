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

