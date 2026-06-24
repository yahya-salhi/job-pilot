import { callLLM } from "@/lib/openrouter";
import { createPostHogServer } from "@/lib/posthog-server";
import type { InsforgeClient } from "./types";

export type ResearchDossier = {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
};

export type ResearchResult =
  | { success: true; dossier: ResearchDossier }
  | { success: false; error: string };

function deriveHomepageUrl(
  company: string,
  redirectUrl: string,
): string {
  const cleanName = company
    .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  return `https://www.${cleanName}.com`;
}

async function synthesiseDossier(
  job: {
    title: string;
    company: string;
    description: string;
    matched_skills: string[];
    missing_skills: string[];
  },
  profile: {
    current_title: string;
    years_experience: number | null;
    experience_level: string;
    skills: string[];
    work_experience: unknown;
  },
  companyResearch: Record<string, unknown>,
): Promise<ResearchDossier> {
  const systemPrompt = `You are a sharp career strategist preparing a candidate to apply for a specific role. You are given (a) research collected from the company's own website, (b) the job posting, and (c) the candidate's profile. Produce a concise, concrete briefing that gives this specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": string,
  "techStack": string[],
  "culture": string[],
  "whyThisRole": string,
  "yourEdge": string[],
  "gapsToAddress": string[],
  "smartQuestions": string[],
  "interviewPrep": string[],
  "sources": string[]
}`;

  const userPrompt = `COMPANY RESEARCH (from their website):
${JSON.stringify(companyResearch)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Matched skills: ${job.matched_skills.join(", ")}
Missing skills: ${job.missing_skills.join(", ")}

CANDIDATE PROFILE:
Current title: ${profile.current_title}
Experience: ${profile.years_experience} years, level ${profile.experience_level}
Skills: ${profile.skills.join(", ")}
Work history: ${JSON.stringify(profile.work_experience)}`;

  const result = await callLLM(systemPrompt, userPrompt, {
    temperature: 0.4,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  const parsed = JSON.parse(result.content) as ResearchDossier;

  return {
    companyOverview: parsed.companyOverview || "",
    techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
    culture: Array.isArray(parsed.culture) ? parsed.culture : [],
    whyThisRole: parsed.whyThisRole || "",
    yourEdge: Array.isArray(parsed.yourEdge) ? parsed.yourEdge : [],
    gapsToAddress: Array.isArray(parsed.gapsToAddress) ? parsed.gapsToAddress : [],
    smartQuestions: Array.isArray(parsed.smartQuestions) ? parsed.smartQuestions : [],
    interviewPrep: Array.isArray(parsed.interviewPrep) ? parsed.interviewPrep : [],
    sources: Array.isArray(parsed.sources) ? parsed.sources : [],
  };
}

async function loadJobAndProfile(
  insforge: InsforgeClient,
  userId: string,
  jobId: string,
): Promise<{
  job: {
    title: string;
    company: string;
    description: string;
    matched_skills: string[];
    missing_skills: string[];
    redirect_url: string;
  };
  profile: {
    current_title: string;
    years_experience: number | null;
    experience_level: string;
    skills: string[];
    work_experience: unknown;
  };
}> {
  const { data: job, error: jobError } = await insforge.database
    .from("jobs")
    .select("title, company, about_role, matched_skills, missing_skills, source_url")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (jobError || !job) {
    throw new Error("Job not found.");
  }

  const { data: profile, error: profileError } = await insforge.database
    .from("profiles")
    .select("current_title, years_experience, experience_level, skills, work_experience")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found.");
  }

  return {
    job: {
      title: job.title,
      company: job.company,
      description: job.about_role || "",
      matched_skills: Array.isArray(job.matched_skills) ? job.matched_skills : [],
      missing_skills: Array.isArray(job.missing_skills) ? job.missing_skills : [],
      redirect_url: job.source_url || "",
    },
    profile: {
      current_title: profile.current_title || "",
      years_experience: profile.years_experience,
      experience_level: profile.experience_level || "mid",
      skills: Array.isArray(profile.skills) ? profile.skills : [],
      work_experience: profile.work_experience,
    },
  };
}

export async function researchCompany(
  insforge: InsforgeClient,
  userId: string,
  jobId: string,
): Promise<ResearchResult> {
  const posthog = createPostHogServer();

  try {
    const { job, profile } = await loadJobAndProfile(insforge, userId, jobId);
    const homepageUrl = deriveHomepageUrl(job.company, job.redirect_url);

    // Browserbase + Stagehand research goes here when implemented.
    // Currently falls back to GPT-4o synthesis from job + profile alone.
    const companyResearch: Record<string, unknown> = {};
    const dossier = await synthesiseDossier(job, profile, companyResearch);

    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier })
      .eq("id", jobId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("[agent/research] Failed to save dossier:", updateError);
    }

    posthog.capture({
      distinctId: userId,
      event: "company_researched",
      properties: { userId, jobId, company: job.company },
    });

    return { success: true, dossier };
  } catch (error) {
    console.error("[agent/research]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Research failed.",
    };
  } finally {
    await posthog.shutdown();
  }
}
