import { callLLM, getResumeGenerateModel, safeParseJson } from "@/lib/openrouter";
import {
  renderResumePdf,
  type ResumeContent,
  type ContactInfo,
} from "@/services/resume-pdf";
import type { InsforgeClient } from "@/agent/types";
import { generatedResumePath, RESUMES_BUCKET } from "@/lib/storage-paths";

export type GenerateResult =
  | { success: true; url: string; storageKey: string }
  | { success: false; error: string; status: number };

type ProfileRecord = {
  full_name: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: unknown;
  education: unknown;
  linkedin_url: string | null;
  portfolio_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
};

function buildSystemPrompt(): string {
  return `You are a professional resume writer. Given a candidate's profile data, generate polished, professional resume content.

Return ONLY valid JSON matching this exact shape:
{
  "summary": "2-3 sentence professional summary paragraph",
  "experience": [
    {
      "company": "string",
      "title": "string",
      "dateRange": "string (e.g. 'Jan 2020 - Present')",
      "bullets": ["array of 2-4 polished bullet points describing achievements and responsibilities"]
    }
  ],
  "skills": ["array of skill strings — reformat and organize from the input"],
  "education": {
    "degree": "string",
    "field": "string",
    "institution": "string",
    "year": "string"
  }
}

Rules:
- Write a compelling professional summary that highlights the candidate's strengths and career trajectory.
- Polish work experience responsibilities into achievement-oriented bullet points. Use strong action verbs.
- Do not invent experience, skills, education, or facts that are not in the provided profile.
- If a section has no data, return its default value (empty array or empty strings).
- Keep the resume to a single page — be concise.
- Return ONLY valid JSON with no markdown.`;
}

function buildUserPrompt(profile: ProfileRecord): string {
  return `Generate a professional resume from this profile data:

Full Name: ${profile.full_name}
Current Title: ${profile.current_title}
Experience Level: ${profile.experience_level}
Years of Experience: ${profile.years_experience}
Skills: ${(profile.skills || []).join(", ")}
Industries: ${(profile.industries || []).join(", ")}

Work Experience:
${JSON.stringify(profile.work_experience || [], null, 2)}

Education:
${JSON.stringify(profile.education || {}, null, 2)}

LinkedIn: ${profile.linkedin_url || "Not provided"}
Portfolio: ${profile.portfolio_url || "Not provided"}`;
}

export async function generateResumePipeline(
  insforge: InsforgeClient,
  userId: string,
): Promise<GenerateResult> {
  const { data: profile, error: profileError } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      error: "Complete and save your profile before generating a resume.",
      status: 400,
    };
  }

  const llmResult = await callLLM(buildSystemPrompt(), buildUserPrompt(profile), {
    model: getResumeGenerateModel(),
    temperature: 0.7,
    maxTokens: 1000,
  });

  if (!llmResult.success) {
    return {
      success: false,
      error: "AI generation failed. Please try again.",
      status: 502,
    };
  }

  const resumeContent = safeParseJson(llmResult.content, null as ResumeContent | null);
  if (!resumeContent) {
    return {
      success: false,
      error: "AI generation returned invalid data. Please try again.",
      status: 502,
    };
  }

  const contact: ContactInfo = {
    email: profile.email || undefined,
    phone: profile.phone || undefined,
    location: profile.location || undefined,
  };

  const pdfBuffer = await renderResumePdf(
    resumeContent,
    profile.full_name || "Candidate",
    contact,
  );

  const storagePath = generatedResumePath(userId);
  const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], {
    type: "application/pdf",
  });
  const { data: uploadData, error: uploadError } = await insforge.storage
    .from(RESUMES_BUCKET)
    .upload(storagePath, pdfBlob);

  if (uploadError || !uploadData?.url) {
    return {
      success: false,
      error: "Failed to save generated resume. Please try again.",
      status: 500,
    };
  }

  const resumePdfUrl = uploadData.url;

  const { error: updateError } = await insforge.database
    .from("profiles")
    .update({ resume_pdf_url: resumePdfUrl, resume_storage_key: storagePath })
    .eq("id", userId);

  if (updateError) {
    console.error(
      "[api/resume/generate] profile update error:",
      updateError,
    );
  }

  return { success: true, url: resumePdfUrl, storageKey: storagePath };
}
