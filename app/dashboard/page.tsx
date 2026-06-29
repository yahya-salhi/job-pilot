import { createInsforgeServer } from "@/lib/insforge-server";
import { Footer } from "@/components/layout/Footer";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Charts } from "@/components/dashboard/Charts";
import { IncompleteProfileBanner } from "@/components/dashboard/IncompleteProfileBanner";

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

type ActivityEntry = {
  type: "agent_run" | "company_research";
  description: string;
  timestamp: string;
  sortKey: string;
};

export default async function DashboardPage() {
  let profileComplete = true;
  let totalJobs = 0;
  let avgMatchRate = 0;
  let companiesResearched = 0;
  let jobsThisWeek = 0;
  let activityEntries: ActivityEntry[] = [];

  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const userId = authData?.user?.id;

    if (userId) {
      const { data: profile } = await insforge.database
        .from("profiles")
        .select("is_complete")
        .eq("id", userId)
        .single();
      if (profile) {
        profileComplete = profile.is_complete ?? false;
      }

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [countResult, avgResult, researchedResult, weekResult, runsResult, researchJobsResult] = await Promise.all([
        insforge.database.from("jobs").select("id", { count: "exact", head: true }).eq("user_id", userId),
        insforge.database.from("jobs").select("match_score").eq("user_id", userId),
        insforge.database.from("jobs").select("id", { count: "exact", head: true }).eq("user_id", userId).not("company_research", "is", null),
        insforge.database.from("jobs").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("found_at", weekAgo.toISOString()),
        insforge.database.from("agent_runs")
          .select("id, job_title_searched, jobs_found, completed_at")
          .eq("user_id", userId)
          .eq("status", "completed")
          .not("completed_at", "is", null)
          .order("completed_at", { ascending: false })
          .limit(10),
        insforge.database.from("jobs")
          .select("id, company, found_at")
          .eq("user_id", userId)
          .not("company_research", "is", null)
          .order("found_at", { ascending: false })
          .limit(10),
      ]);

      totalJobs = countResult.count ?? 0;

      if (avgResult.data && avgResult.data.length > 0) {
        const sum = avgResult.data.reduce((acc, row) => acc + (row.match_score ?? 0), 0);
        avgMatchRate = Math.round(sum / avgResult.data.length);
      }

      companiesResearched = researchedResult.count ?? 0;
      jobsThisWeek = weekResult.count ?? 0;

      if (runsResult.data) {
        for (const run of runsResult.data) {
          if (run.completed_at) {
            activityEntries.push({
              type: "agent_run",
              description: `Found ${run.jobs_found} jobs for ${run.job_title_searched}`,
              timestamp: timeAgo(new Date(run.completed_at)),
              sortKey: run.completed_at,
            });
          }
        }
      }

      if (researchJobsResult.data) {
        for (const job of researchJobsResult.data) {
          activityEntries.push({
            type: "company_research",
            description: `Researched ${job.company}`,
            timestamp: timeAgo(new Date(job.found_at)),
            sortKey: job.found_at,
          });
        }
      }

      activityEntries.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
      activityEntries = activityEntries.slice(0, 8);
    }
  } catch (error) {
    console.error("[dashboard]", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>

          {!profileComplete && <IncompleteProfileBanner />}

          <StatsBar
            totalJobs={totalJobs}
            avgMatchRate={avgMatchRate}
            companiesResearched={companiesResearched}
            jobsThisWeek={jobsThisWeek}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity entries={activityEntries} />
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-text-primary mb-4">Jobs Found Over Time</h2>
              <svg width="100%" height={140} viewBox="0 0 300 140" preserveAspectRatio="none" className="overflow-visible">
                <defs>
                  <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                  const y = 10 + 100 - frac * 100;
                  return (
                    <line key={frac} x1={10} y1={y} x2={290} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 3" />
                  );
                })}
                <path d="M15,90 L55,60 L95,75 L135,30 L175,55 L215,95 L255,40 Z" fill="url(#jobsGradient)" />
                <path d="M15,90 L55,60 L95,75 L135,30 L175,55 L215,95 L255,40" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {[[15,90],[55,60],[95,75],[135,30],[175,55],[215,95],[255,40]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="var(--color-accent)" stroke="white" strokeWidth="2" />
                ))}
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                  <text key={i} x={15 + i * 40} y={130} textAnchor="middle" fill="#9CA3AF" fontSize="10">{d}</text>
                ))}
              </svg>
            </div>
          </div>

          <Charts />
        </div>
      </main>
      <Footer />
    </div>
  );
}
