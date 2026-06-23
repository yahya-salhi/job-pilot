import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/require-user";
import { extractResumePipeline } from "@/lib/resume-extraction-pipeline";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { user, insforge } = await requireUser();

    const result = await extractResumePipeline(insforge, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, profilePatch: result.profilePatch });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    console.error("[api/resume/extract]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract profile from resume. Please try again.",
      },
      { status: 500 },
    );
  }
}
