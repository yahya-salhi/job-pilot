import { createBrowserClient } from "@insforge/sdk/ssr";

function localFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.includes("/api/auth/refresh")) {
    // Rewrite backend refresh calls to the local route handler so that
    // the httpOnly refresh-token cookie (valid only on our origin) is sent.
    return fetch("/api/auth/refresh", { ...init, credentials: "include" });
  }
  return fetch(input, init);
}

// Browser context only — reads the access-token cookie and refreshes
// the session through /api/auth/refresh when it expires.
// Reads NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY from env.
export const insforge = createBrowserClient({ fetch: localFetch });
