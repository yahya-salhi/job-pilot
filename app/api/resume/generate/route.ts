import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { generateResumePipeline } from "@/orchestrators/resume-generation-pipeline";
import { createLLMProvider } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST() {
  return withAuth(async ({ user, insforge }) => {
    const llm = createLLMProvider();
    const result = await generateResumePipeline(llm, insforge, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, url: result.url, storageKey: result.storageKey });
  }, { logLabel: "api/resume/generate", errorMessage: "Failed to generate resume. Please try again." });
}
