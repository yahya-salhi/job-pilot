import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

if (!baseUrl) throw new Error("Missing env.NEXT_PUBLIC_INSFORGE_URL");
if (!anonKey) throw new Error("Missing env.NEXT_PUBLIC_INSFORGE_ANON_KEY");

// Server context only — Server Components, Route Handlers, Server Actions.
export const createInsforgeServer = async () => {
  const cookieStore = await cookies();
  return createServerClient({
    baseUrl,
    anonKey,
    cookies: cookieStore,
  });
};
