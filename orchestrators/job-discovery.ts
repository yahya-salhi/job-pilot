import { searchJobs, mapAdzunaJobToScored } from "@/services/adzuna";
import { MATCH_THRESHOLD } from "@/constants/job-scoring";
import { scoreJob } from "@/agent/matcher";
import type { ILLMProvider } from "@/types/llm-provider";
import type { IAnalyticsService } from "@/types/analytics-service";
import { saveJob } from "@/data/jobs-repo";
import { createAgentRun, completeAgentRun } from "@/data/agent-runs-repo";
import { getProfileSkills } from "@/data/profiles-repo";
import type { InsforgeClient, AgentFindResult } from "@/agent/types";

export async function runJobDiscovery(
  llm: ILLMProvider,
  analytics: IAnalyticsService,
  insforge: InsforgeClient,
  userId: string,
  jobTitle: string,
  location: string,
): Promise<AgentFindResult> {
  try {
    const runId = await createAgentRun(insforge, userId, jobTitle, location);

    await analytics.capture(userId, "job_search_started", { userId, jobTitle, location });

    const adzunaJobs = await searchJobs(jobTitle, location);

    if (adzunaJobs.length === 0) {
      await completeAgentRun(insforge, runId, 0);
      return {
        success: true,
        totalFound: 0,
        strongMatches: 0,
        message: "No jobs found. Try different search terms.",
      };
    }

    const { skills, summary } = await getProfileSkills(insforge, userId);

    let strongMatches = 0;
    let savedCount = 0;

    for (const adzunaJob of adzunaJobs) {
      const score = await scoreJob(
        llm,
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

      await analytics.capture(userId, "job_found", { userId, source: "search", matchScore: score.matchScore });
    }

    await completeAgentRun(insforge, runId, savedCount);

    return {
      success: true,
      totalFound: savedCount,
      strongMatches,
      message: `Found ${savedCount} jobs and saved ${strongMatches} strong matches.`,
    };
  } catch (error) {
    console.error("[orchestrators/job-discovery] Discovery failed:", error);

    await analytics.capture(userId, "job_search_error", { userId, jobTitle, location, error: String(error) });

    return {
      success: false,
      totalFound: 0,
      strongMatches: 0,
      message: "Job discovery failed. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
