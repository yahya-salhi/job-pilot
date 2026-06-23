import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { generateResumePipeline } from "@/lib/resume-generation-pipeline";

export const runtime = "nodejs";

export async function POST() {
  try {
    const insforge = await createInsforgeServer();

    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to generate a resume." },
        { status: 401 },
      );
    }

    const result = await generateResumePipeline(insforge, authData.user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
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
