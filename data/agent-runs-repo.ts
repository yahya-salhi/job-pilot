import type { InsforgeClient } from "@/agent/types";

export type AgentRunRow = {
  id: string;
  job_title_searched: string | null;
  jobs_found: number | null;
  completed_at: string | null;
};

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
    console.error("[data/agent-runs] Failed to update agent run:", error);
  }
}

export async function getRecentAgentRuns(
  insforge: InsforgeClient,
  userId: string,
  limit = 10,
): Promise<AgentRunRow[]> {
  const { data } = await insforge.database
    .from("agent_runs")
    .select("id, job_title_searched, jobs_found, completed_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AgentRunRow[];
}
