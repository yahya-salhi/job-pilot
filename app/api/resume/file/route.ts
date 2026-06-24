import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { getResumeFilePipeline } from "@/orchestrators/resume-file-pipeline";

export const runtime = "nodejs";

export async function GET() {
  return withAuth(async ({ user, insforge }) => {
    const result = await getResumeFilePipeline(insforge, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${result.filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  }, { logLabel: "api/resume/file", errorMessage: "Failed to load resume." });
}
