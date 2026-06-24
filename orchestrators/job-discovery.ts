import { searchJobs, mapAdzunaJobToScored } from "@/services/adzuna";
import type { ScoredJobData } from "@/services/adzuna";
import { MATCH_THRESHOLD } from "@/constants/job-scoring";
import { scoreJob } from "@/agent/matcher";
import type { InsforgeClient, AgentFindResult, AnalyticsEvent } from "@/agent/types";

async function createAgentRun(
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

async function completeAgentRun(
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
    console.error("[orchestrators/job-discovery] Failed to update agent run:", error);
  }
}

async function saveJob(
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
    console.error(`[orchestrators/job-discovery] Failed to save job "${job.title}":`, error);
  }
}

async function loadUserProfile(
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

export async function runJobDiscovery(
  insforge: InsforgeClient,
  userId: string,
  jobTitle: string,
  location: string,
): Promise<AgentFindResult> {
  const events: AnalyticsEvent[] = [
    {
      event: "job_search_started",
      properties: { userId, jobTitle, location },
    },
  ];

  try {
    const runId = await createAgentRun(insforge, userId, jobTitle, location);

    const adzunaJobs = await searchJobs(jobTitle, location);

    if (adzunaJobs.length === 0) {
      await completeAgentRun(insforge, runId, 0);
      return {
        success: true,
        totalFound: 0,
        strongMatches: 0,
        message: "No jobs found. Try different search terms.",
        events,
      };
    }

    const { skills, summary } = await loadUserProfile(insforge, userId);

    let strongMatches = 0;
    let savedCount = 0;

    for (const adzunaJob of adzunaJobs) {
      const score = await scoreJob(
        adzunaJob.title,
        adzunaJob.company.display_name,
        adzunaJob.description,
        skills,
        summary,
      );

      const isStrong = score.matchScore >= MATCH_THRESHOLD;
      if (isStrong) strongMatches++;

      const scored = mapAdzunaJobToScored(
        adzunaJob,
        score.matchScore,
        score.matchReason,
        score.matchedSkills,
        score.missingSkills,
      );

      await saveJob(insforge, runId, userId, scored);
      savedCount++;

      events.push({
        event: "job_found",
        properties: { userId, source: "search", matchScore: score.matchScore },
      });
    }

    await completeAgentRun(insforge, runId, savedCount);

    return {
      success: true,
      totalFound: savedCount,
      strongMatches,
      message: `Found ${savedCount} jobs and saved ${strongMatches} strong matches.`,
      events,
    };
  } catch (error) {
    console.error("[orchestrators/job-discovery] Discovery failed:", error);

    events.push({
      event: "job_search_started",
      properties: { userId, jobTitle, location, error: String(error) },
    });

    return {
      success: false,
      totalFound: 0,
      strongMatches: 0,
      message: "Job discovery failed. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
      events,
    };
  }
}
