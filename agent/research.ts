import { extractJson, getResearchModel } from "@/lib/openrouter";
import { stripHtml } from "@/lib/utils";
import { fireEvents } from "@/lib/fire-events";
import { getJobForResearch, updateCompanyResearch } from "@/data/jobs-repo";
import { getProfileForResearch } from "@/data/profiles-repo";
import type { CompanyResearch } from "@/types/job";
import type { InsforgeClient } from "./types";

export type ResearchResult =
  | { success: true; dossier: CompanyResearch }
  | { success: false; error: string };

async function followRedirect(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    return response.url;
  } catch {
    return null;
  }
}

const TWO_PART_TLDS = new Set([
  "co.uk", "com.au", "co.jp", "co.nz", "co.kr", "co.in",
  "org.uk", "ac.uk", "gov.uk", "net.au", "org.au",
  "com.br", "co.il", "co.za", "com.mx", "com.ar",
]);

function stripSubdomain(hostname: string): string {
  const withoutWww = hostname.replace(/^www\./, "");
  const parts = withoutWww.split(".");
  if (parts.length <= 2) return withoutWww;

  const lastTwo = parts.slice(-2).join(".");
  if (TWO_PART_TLDS.has(lastTwo)) {
    return parts.length > 3 ? parts.slice(1).join(".") : withoutWww;
  }

  return parts.slice(1).join(".");
}

async function resolveHomepageUrl(
  company: string,
  redirectUrl: string,
): Promise<string> {
  if (redirectUrl) {
    const finalUrl = await followRedirect(redirectUrl);
    if (finalUrl && !finalUrl.includes("adzuna.com")) {
      try {
        const url = new URL(finalUrl);
        const rootDomain = stripSubdomain(url.hostname);
        return `https://${rootDomain}`;
      } catch {
        // fall through to company-name fallback
      }
    }
  }

  const cleanName = company
    .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  return `https://www.${cleanName}.com`;
}

type WebsiteExtraction = {
  companyOverview: string;
  techMentions: string[];
  signals: string[];
};

type WebsiteResearch = {
  companyOverview: string;
  techMentions: string[];
  signals: string[];
  homepageUrl: string;
};

async function researchWebsite(
  homepageUrl: string,
): Promise<WebsiteExtraction | null> {
  try {
    const response = await fetch(homepageUrl, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JobPilot/1.0)" },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const text = stripHtml(html);

    if (text.length < 50) return null;

    const result = await extractJson(
      `You are a company research assistant. Extract structured information from the text of a company's homepage.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": "string — what the company does in 1-2 sentences",
  "techMentions": ["string array — any specific technologies, languages, or platforms mentioned"],
  "signals": ["string array — funding, notable customers, scale, mission, recent launches"]
}`,
      `HOMEPAGE TEXT:\n${text.slice(0, 6000)}`,
      (raw) => {
        if (!raw || typeof raw !== "object") return null;
        const d = raw as Record<string, unknown>;
        return {
          companyOverview: (d.companyOverview as string) || "",
          techMentions: Array.isArray(d.techMentions) ? d.techMentions as string[] : [],
          signals: Array.isArray(d.signals) ? d.signals as string[] : [],
        } satisfies WebsiteExtraction;
      },
      { model: getResearchModel(), temperature: 0.3 },
    );

    if (!result.success) return null;
    return result.data;
  } catch {
    return null;
  }
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
  companyResearch: Partial<WebsiteResearch>,
): Promise<CompanyResearch> {
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

  const result = await extractJson(systemPrompt, userPrompt, (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const d = raw as Record<string, unknown>;
    return {
      companyOverview: (d.companyOverview as string) || "",
      techStack: Array.isArray(d.techStack) ? d.techStack as string[] : [],
      culture: Array.isArray(d.culture) ? d.culture as string[] : [],
      whyThisRole: (d.whyThisRole as string) || "",
      yourEdge: Array.isArray(d.yourEdge) ? d.yourEdge as string[] : [],
      gapsToAddress: Array.isArray(d.gapsToAddress) ? d.gapsToAddress as string[] : [],
      smartQuestions: Array.isArray(d.smartQuestions) ? d.smartQuestions as string[] : [],
      interviewPrep: Array.isArray(d.interviewPrep) ? d.interviewPrep as string[] : [],
      sources: Array.isArray(d.sources) ? d.sources as string[] : [],
    };
  }, {
    model: getResearchModel(),
    temperature: 0.4,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export async function researchCompany(
  insforge: InsforgeClient,
  userId: string,
  jobId: string,
): Promise<ResearchResult> {
  try {
    const job = await getJobForResearch(insforge, jobId, userId);
    const profile = await getProfileForResearch(insforge, userId);
    const homepageUrl = await resolveHomepageUrl(job.company, job.redirect_url);

    const extraction = await researchWebsite(homepageUrl);

    const companyResearch: Partial<WebsiteResearch> = extraction
      ? {
          companyOverview: extraction.companyOverview,
          techMentions: extraction.techMentions,
          signals: extraction.signals,
          homepageUrl,
        }
      : {};

    const dossier = await synthesiseDossier(
      { title: job.title, company: job.company, description: job.description, matched_skills: job.matched_skills, missing_skills: job.missing_skills },
      { current_title: profile.current_title, years_experience: profile.years_experience, experience_level: profile.experience_level, skills: profile.skills, work_experience: profile.work_experience },
      companyResearch,
    );

    await updateCompanyResearch(insforge, jobId, userId, dossier);

    await fireEvents(userId, [
      { event: "company_researched", properties: { userId, jobId, company: job.company } },
    ]);

    return { success: true, dossier };
  } catch (error) {
    console.error("[agent/research]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Research failed.",
    };
  }
}
