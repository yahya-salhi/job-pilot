import { createBrowserClient } from "@insforge/sdk/ssr";

if (!process.env.NEXT_PUBLIC_INSFORGE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_INSFORGE_URL");
}
if (!process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_INSFORGE_ANON_KEY");
}

// Browser context only — reads the access-token cookie and refreshes
// the session through /api/auth/refresh when it expires.
export const insforge = createBrowserClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});
