export type AdzunaJob = {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted: "0" | "1";
  contract_type?: string;
  created: string;
  category: { tag: string; label: string };
};

const COUNTRY_MAP: Record<string, string> = {
  us: "us",
  gb: "gb",
  uk: "gb",
  au: "au",
  ca: "ca",
};

function detectCountry(location: string): string {
  const parts = location.toLowerCase().split(/[\s,]+/);
  for (const part of parts) {
    if (COUNTRY_MAP[part]) return COUNTRY_MAP[part];
  }
  return "us";
}

export function detectCountryFromLocation(location: string): string {
  if (!location || !location.trim()) return "us";
  return detectCountry(location);
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min) return null;
  const minK = Math.round(min / 1000);
  const maxK = max ? Math.round(max / 1000) : minK;
  return `$${minK}k - $${maxK}k`;
}

export type ScoredJobData = {
  title: string;
  company: string;
  location: string;
  salary: string | null;
  source_url: string;
  external_apply_url: string;
  description: string;
  job_type: string;
  match_score: number;
  match_reason: string;
  matched_skills: string[];
  missing_skills: string[];
  found_at: string;
};

export async function searchJobs(
  jobTitle: string,
  location: string,
  country?: string,
): Promise<AdzunaJob[]> {
  const resolvedCountry = country || detectCountryFromLocation(location);
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("ADZUNA_APP_ID and ADZUNA_APP_KEY must be configured.");
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: jobTitle,
    category: "it-jobs",
    results_per_page: "10",
    "content-type": "application/json",
  });

  if (location && location.trim()) {
    params.set("where", location);
  }

  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${resolvedCountry}/search/1?${params}`,
  );

  if (!response.ok) {
    throw new Error(`Adzuna API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export function mapAdzunaJobToScored(
  job: AdzunaJob,
  matchScore: number,
  matchReason: string,
  matchedSkills: string[],
  missingSkills: string[],
): ScoredJobData {
  return {
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name,
    salary: formatSalary(job.salary_min, job.salary_max),
    source_url: job.redirect_url,
    external_apply_url: job.redirect_url,
    description: job.description,
    job_type: job.contract_type || "fulltime",
    match_score: matchScore,
    match_reason: matchReason,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    found_at: new Date().toISOString(),
  };
}
