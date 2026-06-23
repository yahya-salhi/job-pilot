import { NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/require-user";
import { generateResumePipeline } from "@/lib/resume-generation-pipeline";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { user, insforge } = await requireUser();

    const result = await generateResumePipeline(insforge, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, url: result.url, storageKey: result.storageKey });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    console.error("[api/resume/generate]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate resume. Please try again.",
      },
      { status: 500 },
    );
  }
}
