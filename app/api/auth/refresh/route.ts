import { refreshAuth } from "@insforge/sdk/ssr";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  console.log("[auth/refresh] Cookie header present:", !!cookieHeader);
  if (cookieHeader) {
    const match = cookieHeader.match(/insforge_refresh_token=([^;]+)/);
    console.log("[auth/refresh] Refresh token in cookie:", !!match);
  }

  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

  const result = await refreshAuth({ baseUrl, anonKey, request });

  if (result.error) {
    console.log("[auth/refresh] Error:", result.error.message);
    return NextResponse.json(
      { error: result.error.error, message: result.error.message, statusCode: result.error.statusCode },
      { status: result.error.statusCode || 500 },
    );
  }

  return result.response;
}
