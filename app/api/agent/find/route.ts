import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { runJobDiscovery } from "@/orchestrators/job-discovery";
import { createLLMProvider } from "@/lib/llm";
import { createAnalyticsService } from "@/lib/analytics";

export const runtime = "nodejs";

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

    const llm = createLLMProvider();
    const analytics = createAnalyticsService();
    const result = await runJobDiscovery(
      llm,
      analytics,
      insforge,
      user.id,
      jobTitle.trim(),
      location.trim(),
    );

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
