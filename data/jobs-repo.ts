import type { InsforgeClient } from "@/agent/types";
import type { ScoredJobData } from "@/services/adzuna";
import type { CompanyResearch } from "@/types/job";

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
