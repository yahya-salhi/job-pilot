import { searchJobs, mapAdzunaJobToScored } from "@/services/adzuna";
import { MATCH_THRESHOLD } from "@/constants/job-scoring";
import { createPostHogServer } from "@/lib/posthog-server";
import { scoreJob } from "./matcher";
import { createAgentRun, completeAgentRun, saveJob, loadUserProfile } from "./persistence";
import type { InsforgeClient, AgentFindResult } from "./types";

export async function runAdzunaDiscovery(
  insforge: InsforgeClient,
  userId: string,
  jobTitle: string,
  location: string,
): Promise<AgentFindResult> {
  const posthog = createPostHogServer();

  try {
    posthog.capture({
      distinctId: userId,
      event: "job_search_started",
      properties: { userId, jobTitle, location },
    });

    const runId = await createAgentRun(insforge, userId, jobTitle, location);

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

      posthog.capture({
        distinctId: userId,
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
    };
  } catch (error) {
    console.error("[agent/adzuna] Discovery failed:", error);

    posthog.capture({
      distinctId: userId,
      event: "job_search_started",
      properties: { userId, jobTitle, location, error: String(error) },
    });

    return {
      success: false,
      totalFound: 0,
      strongMatches: 0,
      message: "Job discovery failed. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await posthog.shutdown();
  }
}
