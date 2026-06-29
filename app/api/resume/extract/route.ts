import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { extractResumePipeline } from "@/orchestrators/resume-extraction-pipeline";
import { createLLMProvider } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST() {
  return withAuth(async ({ user, insforge }) => {
    const llm = createLLMProvider();
    const result = await extractResumePipeline(llm, insforge, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, profilePatch: result.profilePatch });
  }, { logLabel: "api/resume/extract", errorMessage: "Failed to extract profile from resume. Please try again." });
}
