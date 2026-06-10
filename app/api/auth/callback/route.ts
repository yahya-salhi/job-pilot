import { NextResponse, type NextRequest } from "next/server";
import { setAuthCookies } from "@insforge/sdk/ssr";
import { createInsforgeServer } from "@/lib/insforge-server";

const CODE_VERIFIER_COOKIE = "insforge_code_verifier";

function redirectTo(request: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.delete(CODE_VERIFIER_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("insforge_code");
    if (!code) {
      return redirectTo(request, "/login?error=oauth_failed");
    }

    const codeVerifier = request.cookies.get(CODE_VERIFIER_COOKIE)?.value;
    if (!codeVerifier) {
      return redirectTo(request, "/login?error=missing_verifier");
    }

    const insforge = await createInsforgeServer();
    const { data, error } = await insforge.auth.exchangeOAuthCode(code, codeVerifier);

    if (error || !data?.accessToken) {
      return redirectTo(request, "/login?error=exchange_failed");
    }

    const response = redirectTo(request, "/dashboard");
    setAuthCookies(response.cookies, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return response;
  } catch {
    return redirectTo(request, "/login?error=oauth_failed");
  }
}
