import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { researchCompany } from "@/agent/research";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return withAuth(async ({ user, insforge }) => {
    const body = await request.json();
    const jobId: string = body.jobId || "";

    if (!jobId.trim()) {
      return NextResponse.json(
        { success: false, error: "Job ID is required." },
        { status: 400 },
      );
    }

    const result = await researchCompany(insforge, user.id, jobId.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      dossier: result.dossier,
    });
  }, { logLabel: "api/agent/research", errorMessage: "Company research failed. Please try again." });
}
