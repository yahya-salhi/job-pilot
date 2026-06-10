"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthCookies } from "@insforge/sdk/ssr";
import { createInsforgeServer } from "@/lib/insforge-server";

const ALLOWED_PROVIDERS = ["google", "github"] as const;
export type OAuthProvider = (typeof ALLOWED_PROVIDERS)[number];

const CODE_VERIFIER_COOKIE = "insforge_code_verifier";

async function resolveOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signInWithOAuthAction(provider: OAuthProvider) {
  if (!ALLOWED_PROVIDERS.includes(provider)) {
    redirect("/login?error=invalid_provider");
  }

  const insforge = await createInsforgeServer();
  const origin = await resolveOrigin();

  const { data, error } = await insforge.auth.signInWithOAuth(provider, {
    redirectTo: `${origin}/api/auth/callback`,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url) {
    redirect("/login?error=oauth_failed");
  }

  if (data.codeVerifier) {
    const cookieStore = await cookies();
    cookieStore.set(CODE_VERIFIER_COOKIE, data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
  }

  redirect(data.url);
}

export async function signOutAction() {
  clearAuthCookies(await cookies());
}
