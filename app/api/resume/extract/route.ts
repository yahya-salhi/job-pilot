import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { extractResumePipeline } from "@/orchestrators/resume-extraction-pipeline";

export const runtime = "nodejs";

export async function POST() {
  return withAuth(async ({ user, insforge }) => {
    const result = await extractResumePipeline(insforge, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, profilePatch: result.profilePatch });
  }, { logLabel: "api/resume/extract", errorMessage: "Failed to extract profile from resume. Please try again." });
}
