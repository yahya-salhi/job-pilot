import { callLLM, getResearchModel, safeParseJson } from "@/lib/openrouter";
import type { CompanyResearch } from "@/types/job";
import type { InsforgeClient, AnalyticsEvent } from "./types";

export type ResearchResult =
  | { success: true; dossier: CompanyResearch; events: AnalyticsEvent[] }
  | { success: false; error: string; events: AnalyticsEvent[] };

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

    const result = await callLLM(
      `You are a company research assistant. Extract structured information from the text of a company's homepage.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": "string — what the company does in 1-2 sentences",
  "techMentions": ["string array — any specific technologies, languages, or platforms mentioned"],
  "signals": ["string array — funding, notable customers, scale, mission, recent launches"]
}`,
      `HOMEPAGE TEXT:\n${text.slice(0, 6000)}`,
      { model: getResearchModel(), temperature: 0.3 },
    );

    if (!result.success) return null;

    const parsed = safeParseJson(result.content, null as WebsiteExtraction | null);
    if (!parsed) return null;

    return {
      companyOverview: parsed.companyOverview || "",
      techMentions: Array.isArray(parsed.techMentions) ? parsed.techMentions : [],
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
    };
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

  const result = await callLLM(systemPrompt, userPrompt, {
    model: getResearchModel(),
    temperature: 0.4,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  const parsed = safeParseJson(result.content, null as CompanyResearch | null);
  if (!parsed) {
    throw new Error("Failed to parse research synthesis response.");
  }

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
  try {
    const { job, profile } = await loadJobAndProfile(insforge, userId, jobId);
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

    const dossier = await synthesiseDossier(job, profile, companyResearch);

    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier })
      .eq("id", jobId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("[agent/research] Failed to save dossier:", updateError);
    }

    return {
      success: true,
      dossier,
      events: [
        {
          event: "company_researched",
          properties: { userId, jobId, company: job.company },
        },
      ],
    };
  } catch (error) {
    console.error("[agent/research]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Research failed.",
      events: [],
    };
  }
}
