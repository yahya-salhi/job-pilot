import "@/lib/pdf-parse-setup";
import { callLLM, getResumeExtractModel } from "@/lib/openrouter";
import {
  buildResumeExtractionPrompt,
  extractTextFromPdf,
  isResumeTextSufficient,
  parseExtractedProfile,
} from "@/services/resume-extraction";
import type { ExtractedProfilePatch } from "@/mappers/merge-profile-extraction";
import type { InsforgeClient } from "@/agent/types";
import { manualResumePath, RESUMES_BUCKET } from "@/lib/storage-paths";

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

  const result = await callLLM(
    "You extract structured resume data. Return only valid JSON with no markdown.",
    buildResumeExtractionPrompt(resumeText),
    { model: getResumeExtractModel(), temperature: 0.3, maxTokens: 800 },
  );

  if (!result.success) {
    return {
      success: false,
      error: "AI extraction failed. Please try again.",
      status: 502,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(result.content);
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
