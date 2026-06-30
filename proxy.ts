import { NextResponse, type NextRequest } from "next/server";
import {
  updateSession,
  type CookieOptions,
  type CookieStore,
} from "@insforge/sdk/ssr";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/find-jobs"];

function toCookieStore(
  cookies: NextRequest["cookies"] | NextResponse["cookies"],
): CookieStore {
  return {
    get: (name) => cookies.get(name)?.value,
    set: (
      nameOrOptions: string | ({ name: string; value: string } & CookieOptions),
      value?: string,
      options?: CookieOptions,
    ) => {
      if (typeof nameOrOptions === "string") {
        cookies.set(nameOrOptions, value ?? "", options);
      } else {
        cookies.set(nameOrOptions);
      }
    },
    delete: (nameOrOptions: string | { name: string }) => {
      cookies.delete(
        typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name,
      );
    },
  };
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const posthogHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "";

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ${posthogHost} https://www.gstatic.com https://github.githubassets.com;
    connect-src 'self' ${posthogHost} ${insforgeUrl};
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    ${isDev ? "" : "require-trusted-types-for 'script'; trusted-types default;"}
  `;
  return csp.replace(/\s{2,}/g, " ").trim();
}

export default async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  const { accessToken } = await updateSession({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    requestCookies: toCookieStore(request.cookies),
    responseCookies: toCookieStore(response.cookies),
  });

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/login");
  const isProtectedPage = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  const redirectWithCookies = (path: string) => {
    const redirectResponse = NextResponse.redirect(new URL(path, request.url));
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  };

  if (isProtectedPage && !accessToken) {
    return redirectWithCookies("/login");
  }

  if (isAuthPage && accessToken) {
    return redirectWithCookies("/dashboard");
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
