import "@/lib/pdf-parse-setup";
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
import type { ExtractedProfilePatch } from "@/lib/merge-profile-extraction";
import { manualResumePath, RESUMES_BUCKET } from "@/lib/storage-paths";

type InsforgeClient = Awaited<ReturnType<typeof import("./insforge-server").createInsforgeServer>>;

export type ExtractResult =
  | { success: true; profilePatch: ExtractedProfilePatch }
  | { success: false; error: string; status: number };

export async function extractResumePipeline(
  insforge: InsforgeClient,
  userId: string,
): Promise<ExtractResult> {
  const { data: fileBlob, error: downloadError } = await insforge.storage
    .from(RESUMES_BUCKET)
    .download(manualResumePath(userId));

  if (downloadError || !fileBlob) {
    return {
      success: false,
      error: "Upload and save your resume before extracting profile data.",
      status: 400,
    };
  }

  const buffer = Buffer.from(await fileBlob.arrayBuffer());
  const resumeText = await extractTextFromPdf(buffer);

  if (!isResumeTextSufficient(resumeText)) {
    return {
      success: false,
      error: "Could not extract text from this PDF. Please try a different file.",
      status: 400,
    };
  }

  let openrouter;
  try {
    openrouter = createOpenRouterClient();
  } catch {
    return {
      success: false,
      error: "AI extraction is not configured. Contact support.",
      status: 500,
    };
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
    return {
      success: false,
      error: "AI extraction returned an empty response. Please try again.",
      status: 502,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      success: false,
      error: "AI extraction returned invalid data. Please try again.",
      status: 502,
    };
  }

  const profilePatch = parseExtractedProfile(parsed);
  if (!profilePatch) {
    return {
      success: false,
      error:
        "Could not map resume content to profile fields. Try a different PDF.",
      status: 422,
    };
  }

  return { success: true, profilePatch };
}
