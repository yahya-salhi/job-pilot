import { callLLM, safeParseJson } from "@/lib/openrouter";
import type { JobScoreResult } from "./types";

export async function scoreJob(
  jobTitle: string,
  company: string,
  description: string,
  userSkills: string[],
  profileSummary: string,
): Promise<JobScoreResult> {
  const skillsList = userSkills.length > 0
    ? userSkills.join(", ")
    : "No skills listed yet";

  const systemPrompt = `You are a precise job matching engine. Analyze how well a job matches a candidate's profile and return structured JSON.

Rules:
- matchScore: integer 0-100. Be honest — not every job is a strong match.
- matchReason: one paragraph explaining the fit. Mention specific skills alignment.
- matchedSkills: skills the candidate has that the job requires.
- missingSkills: skills the job requires that the candidate lacks.

Return ONLY valid JSON matching this shape:
{
  "matchScore": number,
  "matchReason": string,
  "matchedSkills": string[],
  "missingSkills": string[]
}`;

  const userPrompt = `JOB:
Title: ${jobTitle}
Company: ${company}
Description: ${description || "No description available"}

CANDIDATE:
Skills: ${skillsList}
Profile: ${profileSummary || "No profile details available"}`;

  const result = await callLLM(systemPrompt, userPrompt, {
    temperature: 0.3,
    maxTokens: 300,
  });

  if (!result.success) {
    return {
      matchScore: 0,
      matchReason: "Failed to score this job.",
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const parsed = safeParseJson(result.content, null as JobScoreResult | null);
  if (!parsed) {
    return {
      matchScore: 0,
      matchReason: "Failed to parse scoring response.",
      matchedSkills: [],
      missingSkills: [],
    };
  }

  return {
    matchScore: Math.max(0, Math.min(100, parsed.matchScore || 0)),
    matchReason: parsed.matchReason || "No match reason provided.",
    matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
    missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
  };
}
