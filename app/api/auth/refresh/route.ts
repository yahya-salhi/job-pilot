import { createRefreshAuthRouter } from "@insforge/sdk/ssr";

// Used by the browser client to refresh the access token.
// Rotates the httpOnly refresh-token cookie server-side.
export const { POST } = createRefreshAuthRouter({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
