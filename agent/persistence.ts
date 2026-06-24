import type { ScoredJobData } from "@/services/adzuna";
import type { InsforgeClient } from "./types";

export async function createAgentRun(
  insforge: InsforgeClient,
  userId: string,
  jobTitle: string,
  location: string,
): Promise<string> {
  const { data, error } = await insforge.database
    .from("agent_runs")
    .insert([{
      user_id: userId,
      status: "running",
      job_title_searched: jobTitle,
      location_searched: location || null,
      jobs_found: 0,
    }])
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create agent run: ${error?.message || "Unknown error"}`);
  }

  return data.id;
}

export async function completeAgentRun(
  insforge: InsforgeClient,
  runId: string,
  jobsFound: number,
): Promise<void> {
  const { error } = await insforge.database
    .from("agent_runs")
    .update({
      status: "completed",
      jobs_found: jobsFound,
      completed_at: new Date().toISOString(),
    })
    .eq("id", runId);

  if (error) {
    console.error("[agent/adzuna] Failed to update agent run:", error);
  }
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
    console.error(`[agent/adzuna] Failed to save job "${job.title}":`, error);
  }
}

export async function loadUserProfile(
  insforge: InsforgeClient,
  userId: string,
): Promise<{ skills: string[]; summary: string }> {
  const { data, error } = await insforge.database
    .from("profiles")
    .select("skills, current_title, years_experience, work_experience")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return { skills: [], summary: "" };
  }

  const skills: string[] = Array.isArray(data.skills) ? data.skills : [];
  const summary = [data.current_title, data.years_experience ? `${data.years_experience} years` : ""]
    .filter(Boolean)
    .join(" — ");

  return { skills, summary };
}
