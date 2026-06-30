import { timeAgo } from "@/lib/utils";
import type { IAnalyticsService } from "@/types/analytics-service";
import {
  getJobCount,
  getMatchScores,
  getJobsWithResearchCount,
  getJobsThisWeekCount,
  getRecentResearchJobs,
  getCompanyResearchDayCounts,
} from "@/data/jobs-repo";
import { getRecentAgentRuns } from "@/data/agent-runs-repo";
import { getProfileComplete } from "@/data/jobs-repo";
import type { InsforgeClient } from "@/agent/types";

export type ActivityEntry = {
  type: "agent_run" | "company_research";
  description: string;
  timestamp: string;
  sortKey: string;
};

export type DashboardData = {
  profileComplete: boolean;
  totalJobs: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
  activityEntries: ActivityEntry[];
  jobsFoundData: import("@/types/analytics-service").DayCount[] | null;
  matchScoreData: import("@/types/analytics-service").MatchScoreRange[] | null;
  companyResearchData: import("@/types/analytics-service").DayCount[] | null;
};

export async function loadDashboardData(
  userId: string,
  insforge: InsforgeClient,
  analytics: IAnalyticsService,
): Promise<DashboardData> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [profileComplete, totalJobs, matchScores, companiesResearched, jobsThisWeek, runsResult, researchJobsResult, jobsFound, matchScore, companyResearch] = await Promise.all([
    getProfileComplete(insforge, userId),
    getJobCount(insforge, userId),
    getMatchScores(insforge, userId),
    getJobsWithResearchCount(insforge, userId),
    getJobsThisWeekCount(insforge, userId, weekAgo.toISOString()),
    getRecentAgentRuns(insforge, userId),
    getRecentResearchJobs(insforge, userId),
    analytics.getJobsFoundOverTime(userId),
    analytics.getMatchScoreDistribution(userId),
    getCompanyResearchDayCounts(insforge, userId),
  ]);

  const activityEntries: ActivityEntry[] = [];

  for (const run of runsResult) {
    if (run.completed_at) {
      activityEntries.push({
        type: "agent_run",
        description: `Found ${run.jobs_found} jobs for ${run.job_title_searched}`,
        timestamp: timeAgo(new Date(run.completed_at)),
        sortKey: run.completed_at,
      });
    }
  }

  for (const job of researchJobsResult) {
    activityEntries.push({
      type: "company_research",
      description: `Researched ${job.company}`,
      timestamp: timeAgo(new Date(job.found_at)),
      sortKey: job.found_at,
    });
  }

  activityEntries.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  let avgMatchRate = 0;
  if (matchScores.length > 0) {
    const sum = matchScores.reduce((acc, row) => acc + (row.match_score ?? 0), 0);
    avgMatchRate = Math.round(sum / matchScores.length);
  }

  return {
    profileComplete,
    totalJobs,
    avgMatchRate,
    companiesResearched,
    jobsThisWeek,
    activityEntries: activityEntries.slice(0, 8),
    jobsFoundData: jobsFound.error ? null : jobsFound.data,
    matchScoreData: matchScore.error ? null : matchScore.data,
    companyResearchData: companyResearch.length > 0 ? companyResearch : null,
  };
}
