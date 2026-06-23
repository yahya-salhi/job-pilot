import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getResumeFilePipeline } from "@/lib/resume-file-pipeline";

export const runtime = "nodejs";

export async function GET() {
  try {
    const insforge = await createInsforgeServer();

    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const result = await getResumeFilePipeline(insforge, authData.user.id);

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
    console.error("[api/resume/file]", error);
    return NextResponse.json(
      { success: false, error: "Failed to load resume." },
      { status: 500 },
    );
  }
}
