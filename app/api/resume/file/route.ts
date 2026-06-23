import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/require-user";
import { getResumeFilePipeline } from "@/lib/resume-file-pipeline";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { user, insforge } = await requireUser();

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
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    console.error("[api/resume/file]", error);
    return NextResponse.json(
      { success: false, error: "Failed to load resume." },
      { status: 500 },
    );
  }
}
