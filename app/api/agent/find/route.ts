import { NextResponse } from "next/server";
import { createPostHogServer } from "@/lib/posthog-server";
import { withAuth } from "@/lib/with-auth";
import { runJobDiscovery } from "@/orchestrators/job-discovery";
import type { AnalyticsEvent } from "@/agent/types";

export const runtime = "nodejs";

async function fireEvents(userId: string, events: AnalyticsEvent[]) {
  const posthog = createPostHogServer();
  for (const e of events) {
    posthog.capture({ distinctId: userId, ...e });
  }
  await posthog.shutdown();
}

export async function POST(request: Request) {
  return withAuth(async ({ user, insforge }) => {
    const body = await request.json();
    const jobTitle: string = body.jobTitle || "";
    const location: string = body.location || "";

    if (!jobTitle.trim()) {
      return NextResponse.json(
        { success: false, error: "Job title is required." },
        { status: 400 },
      );
    }

    const result = await runJobDiscovery(
      insforge,
      user.id,
      jobTitle.trim(),
      location.trim(),
    );

    fireEvents(user.id, result.events);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || result.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      totalFound: result.totalFound,
      strongMatches: result.strongMatches,
      message: result.message,
    });
  }, { logLabel: "api/agent/find", errorMessage: "Job discovery failed. Please try again." });
}
