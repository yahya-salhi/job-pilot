import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

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

    const userId = authData.user.id;

    const { data: profile } = await insforge.database
      .from("profiles")
      .select("resume_pdf_url")
      .eq("id", userId)
      .single();

    if (!profile?.resume_pdf_url) {
      return NextResponse.json(
        { success: false, error: "No resume found. Upload or generate one first." },
        { status: 404 },
      );
    }

    const isGenerated = profile.resume_pdf_url.includes("resume-generated.pdf");
    const storagePath = `${userId}/${isGenerated ? "resume-generated.pdf" : "resume.pdf"}`;

    const { data: fileBlob, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(storagePath);

    if (downloadError || !fileBlob) {
      return NextResponse.json(
        { success: false, error: "Resume not found." },
        { status: 404 },
      );
    }

    const buffer = Buffer.from(await fileBlob.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="resume.pdf"`,
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
