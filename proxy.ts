import { NextResponse, type NextRequest } from "next/server";
import {
  updateSession,
  type CookieOptions,
  type CookieStore,
} from "@insforge/sdk/ssr";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/find-jobs"];

// Adapts Next.js request/response cookie stores to the SDK's CookieStore shape
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

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Refresh the access token if expired and sync auth cookies
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

  // Carry refreshed auth cookies over to redirect responses
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
    /*
     * Match all request paths except:
     * - api (route handlers manage their own auth)
     * - _next/static, _next/image (build assets)
     * - favicon.ico and static image files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
