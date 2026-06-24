import type { createInsforgeServer } from "@/lib/insforge-server";

export type InsforgeClient = Awaited<ReturnType<typeof createInsforgeServer>>;

export type AnalyticsEvent = {
  event: string;
  properties: Record<string, unknown>;
};

export type AgentFindResult = {
  success: boolean;
  totalFound: number;
  strongMatches: number;
  message: string;
  error?: string;
  events: AnalyticsEvent[];
};

export type AgentRunRecord = {
  id: string;
  user_id: string;
  status: "running" | "completed" | "failed";
  job_title_searched: string;
  location_searched: string | null;
  jobs_found: number;
  started_at: string;
  completed_at: string | null;
};

export type JobScoreResult = {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};
