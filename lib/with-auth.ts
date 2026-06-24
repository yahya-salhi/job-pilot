import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/require-user";
import type { InsforgeClient } from "@/agent/types";

type AuthContext = {
  user: NonNullable<
    Awaited<ReturnType<InsforgeClient["auth"]["getCurrentUser"]>>["data"]["user"]
  >;
  insforge: InsforgeClient;
};

type ApiHandler = (ctx: AuthContext) => Promise<NextResponse>;

type ActionError = { success: false; error: string };

export async function withAuth(
  handler: ApiHandler,
  options?: { logLabel?: string; errorMessage?: string },
): Promise<NextResponse> {
  try {
    const ctx = await requireUser();
    return await handler(ctx);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    console.error(`[${options?.logLabel ?? "withAuth"}]`, error);
    return NextResponse.json(
      { success: false, error: options?.errorMessage ?? "Internal server error." },
      { status: 500 },
    );
  }
}

export async function withActionAuth<T extends { success: boolean }>(
  handler: (ctx: AuthContext) => Promise<T>,
  options?: { logLabel?: string; errorMessage?: string },
): Promise<T | ActionError> {
  try {
    const ctx = await requireUser();
    return await handler(ctx);
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }

    console.error(`[${options?.logLabel ?? "withActionAuth"}]`, error);
    return { success: false, error: options?.errorMessage ?? "An error occurred." };
  }
}
