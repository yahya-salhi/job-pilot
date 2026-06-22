import { NextResponse } from "next/server";
import "@/lib/pdf-parse-setup";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  createOpenRouterClient,
  getResumeExtractModel,
} from "@/lib/openrouter";
import {
  buildResumeExtractionPrompt,
  extractTextFromPdf,
  isResumeTextSufficient,
  parseExtractedProfile,
} from "@/lib/resume-extraction";

export const runtime = "nodejs";

export async function POST() {
  try {
    const insforge = await createInsforgeServer();

    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to extract your resume." },
        { status: 401 },
      );
    }

    const storagePath = `${authData.user.id}/resume.pdf`;
    const { data: fileBlob, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(storagePath);

    if (downloadError || !fileBlob) {
      return NextResponse.json(
        {
          success: false,
          error: "Upload and save your resume before extracting profile data.",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await fileBlob.arrayBuffer());
    const resumeText = await extractTextFromPdf(buffer);

    if (!isResumeTextSufficient(resumeText)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract text from this PDF. Please try a different file.",
        },
        { status: 400 },
      );
    }

    let openrouter;
    try {
      openrouter = createOpenRouterClient();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI extraction is not configured. Contact support.",
        },
        { status: 500 },
      );
    }

    const completion = await openrouter.chat.completions.create({
      model: getResumeExtractModel(),
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_completion_tokens: 800,
      messages: [
        {
          role: "system",
          content:
            "You extract structured resume data. Return only valid JSON with no markdown.",
        },
        {
          role: "user",
          content: buildResumeExtractionPrompt(resumeText),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "AI extraction returned an empty response. Please try again.",
        },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI extraction returned invalid data. Please try again.",
        },
        { status: 502 },
      );
    }

    const profilePatch = parseExtractedProfile(parsed);
    if (!profilePatch) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not map resume content to profile fields. Try a different PDF.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ success: true, profilePatch });
  } catch (error) {
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
