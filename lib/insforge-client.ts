import { createBrowserClient } from "@insforge/sdk/ssr";

// Browser context only — reads the access-token cookie and refreshes
// the session through /api/auth/refresh when it expires.
// Reads NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY from env.
export const insforge = createBrowserClient();
