import type { InsforgeClient } from "@/agent/types";
import type { ScoredJobData } from "@/services/adzuna";
import type { CompanyResearch, JobDetail, JobRow } from "@/types/job";
import { MATCH_THRESHOLD } from "@/constants/job-scoring";

export type JobQueryParams = {
  userId: string;
  page: number;
  pageSize: number;
  filter?: string;
  sort?: string;
  search?: string;
};

export type PaginatedJobsResult = {
  jobs: JobRow[];
  total: number;
};

export async function getJobsPaginated(
  insforge: InsforgeClient,
  params: JobQueryParams,
): Promise<PaginatedJobsResult> {
  let query = insforge.database
    .from("jobs")
    .select(
      "id, company, title, match_score, salary, source, found_at, location, job_type, about_role, matched_skills, missing_skills, match_reason, source_url, external_apply_url",
      { count: "exact" },
    )
    .eq("user_id", params.userId);

  const filter = params.filter || "all";
  const sort = params.sort || "match_score";
  const search = (params.search || "").trim();

  if (filter === "high") {
    query = query.gte("match_score", MATCH_THRESHOLD);
  } else if (filter === "low") {
    query = query.lt("match_score", MATCH_THRESHOLD);
  }

  if (search) {
    query = query.or(
      `company.ilike.%${search}%,title.ilike.%${search}%`,
    );
  }

  if (sort === "newest") {
    query = query.order("found_at", { ascending: false });
  } else if (sort === "oldest") {
    query = query.order("found_at", { ascending: true });
  } else {
    query = query.order("match_score", { ascending: false });
  }

  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize - 1;
  query = query.range(start, end);

  const { data, count } = await query;
  return {
    jobs: (data ?? []) as unknown as JobRow[],
    total: count ?? 0,
  };
}

export function mapJobRowToDetail(row: Record<string, unknown>): JobDetail {
  return {
    id: row.id as string,
    title: row.title as string | null,
    company: row.company as string | null,
    location: row.location as string | null,
    salary: row.salary as string | null,
    job_type: row.job_type as string | null,
    source: row.source as string,
    source_url: row.source_url as string | null,
    external_apply_url: row.external_apply_url as string | null,
    about_role: row.about_role as string | null,
    responsibilities: row.responsibilities as string[] | null,
    requirements: row.requirements as string[] | null,
    nice_to_have: row.nice_to_have as string[] | null,
    benefits: row.benefits as string[] | null,
    about_company: row.about_company as string | null,
    match_score: row.match_score as number | null,
    match_reason: row.match_reason as string | null,
    matched_skills: row.matched_skills as string[] | null,
    missing_skills: row.missing_skills as string[] | null,
    company_research: row.company_research as CompanyResearch | null,
    found_at: row.found_at as string,
  };
}

export async function getJobById(
  insforge: InsforgeClient,
  jobId: string,
  userId: string,
): Promise<JobDetail | null> {
  const { data, error } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return mapJobRowToDetail(data as Record<string, unknown>);
}

export type JobCountResult = { count: number | null };
export type MatchScoreRow = { match_score: number | null };
export type ResearchJobRow = { id: string; company: string | null; found_at: string };

export async function getProfileComplete(
  insforge: InsforgeClient,
  userId: string,
): Promise<boolean> {
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("is_complete")
    .eq("id", userId)
    .single();
  return profile?.is_complete ?? false;
}

export async function getJobCount(
  insforge: InsforgeClient,
  userId: string,
): Promise<number> {
  const { count } = await insforge.database
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function getMatchScores(
  insforge: InsforgeClient,
  userId: string,
): Promise<MatchScoreRow[]> {
  const { data } = await insforge.database
    .from("jobs")
    .select("match_score")
    .eq("user_id", userId);
  return (data ?? []) as MatchScoreRow[];
}

export async function getJobsWithResearchCount(
  insforge: InsforgeClient,
  userId: string,
): Promise<number> {
  const { count } = await insforge.database
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("company_research", "is", null);
  return count ?? 0;
}

export async function getJobsThisWeekCount(
  insforge: InsforgeClient,
  userId: string,
  since: string,
): Promise<number> {
  const { count } = await insforge.database
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("found_at", since);
  return count ?? 0;
}

export async function getRecentResearchJobs(
  insforge: InsforgeClient,
  userId: string,
  limit = 10,
): Promise<ResearchJobRow[]> {
  const { data } = await insforge.database
    .from("jobs")
    .select("id, company, found_at")
    .eq("user_id", userId)
    .not("company_research", "is", null)
    .order("found_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as ResearchJobRow[];
}

export async function getCompanyResearchDayCounts(
  insforge: InsforgeClient,
  userId: string,
  days = 7,
): Promise<{ day: string; count: number }[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await insforge.database
    .from("jobs")
    .select("found_at")
    .eq("user_id", userId)
    .not("company_research", "is", null)
    .gte("found_at", since.toISOString())
    .order("found_at", { ascending: true });

  if (!data) return [];

  const counts = new Map<string, number>();
  for (const row of data as { found_at: string }[]) {
    const day = row.found_at?.slice(0, 10);
    if (day) counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  return Array.from(counts, ([day, count]) => ({ day, count }));
}

export async function saveJob(
  insforge: InsforgeClient,
  runId: string,
  userId: string,
  job: ScoredJobData,
): Promise<void> {
  const { error } = await insforge.database
    .from("jobs")
    .insert([{
      run_id: runId,
      user_id: userId,
      source: "search",
      source_url: job.source_url,
      external_apply_url: job.external_apply_url,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      job_type: job.job_type,
      about_role: job.description,
      match_score: job.match_score,
      match_reason: job.match_reason,
      matched_skills: job.matched_skills,
      missing_skills: job.missing_skills,
      found_at: job.found_at,
    }]);

  if (error) {
    console.error(`[data/jobs] Failed to save job "${job.title}":`, error);
  }
}

export async function updateCompanyResearch(
  insforge: InsforgeClient,
  jobId: string,
  userId: string,
  dossier: CompanyResearch,
): Promise<void> {
  const { error } = await insforge.database
    .from("jobs")
    .update({ company_research: dossier })
    .eq("id", jobId)
    .eq("user_id", userId);

  if (error) {
    console.error("[data/jobs] Failed to save dossier:", error);
  }
}

export async function getJobForResearch(
  insforge: InsforgeClient,
  jobId: string,
  userId: string,
) {
  const { data: job, error: jobError } = await insforge.database
    .from("jobs")
    .select("title, company, about_role, matched_skills, missing_skills, source_url")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (jobError || !job) {
    throw new Error("Job not found.");
  }

  return {
    title: job.title,
    company: job.company,
    description: job.about_role || "",
    matched_skills: Array.isArray(job.matched_skills) ? job.matched_skills : [],
    missing_skills: Array.isArray(job.missing_skills) ? job.missing_skills : [],
    redirect_url: job.source_url || "",
  };
}
