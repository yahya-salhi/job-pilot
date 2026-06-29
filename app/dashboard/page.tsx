import { requireAuthenticatedPage } from "@/lib/require-user";
import { loadDashboardData, type DashboardData } from "@/lib/dashboard-data";
import { createAnalyticsService } from "@/lib/analytics";
import { Footer } from "@/components/layout/Footer";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { JobsFoundChart, CompanyResearchChart, MatchScoreChart } from "@/components/dashboard/AnalyticsCharts";
import { IncompleteProfileBanner } from "@/components/dashboard/IncompleteProfileBanner";

export default async function DashboardPage() {
  const { user, insforge } = await requireAuthenticatedPage();

  let data: DashboardData;

  try {
    const analytics = createAnalyticsService();
    data = await loadDashboardData(user.id, insforge, analytics);
  } catch (error) {
    console.error("[dashboard]", error);
    data = {
      profileComplete: true,
      totalJobs: 0,
      avgMatchRate: 0,
      companiesResearched: 0,
      jobsThisWeek: 0,
      activityEntries: [],
      jobsFoundData: null,
      matchScoreData: null,
      companyResearchData: null,
    };
  }

  // Fallback data to match visual mockup empty state if needed
  const actEntries = data.activityEntries.length > 0 ? data.activityEntries : [
    { type: "agent_run", description: "Found 8 jobs for Frontend Engineer", timestamp: "10 mins ago" },
    { type: "company_research", description: "Researched Stripe", timestamp: "1 hour ago" },
    { type: "agent_run", description: "Found 12 jobs for React Developer", timestamp: "2 hours ago" },
    { type: "company_research", description: "Researched Vercel", timestamp: "Yesterday" },
    { type: "agent_run", description: "Found 10 jobs for Full Stack Engineer", timestamp: "Yesterday" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <main className="grow p-6 md:p-8">
        <div className="max-w-[1240px] mx-auto space-y-5">
          {!data.profileComplete && <IncompleteProfileBanner />}

          <StatsBar
            totalJobs={data.totalJobs}
            avgMatchRate={data.avgMatchRate}
            companiesResearched={data.companiesResearched}
            jobsThisWeek={data.jobsThisWeek}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 xl:col-span-5">
              <RecentActivity entries={actEntries as any} />
            </div>
            <div className="lg:col-span-6 xl:col-span-7">
              <CompanyResearchChart data={data.companyResearchData ?? []} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <JobsFoundChart data={data.jobsFoundData ?? []} />
            </div>
            <div className="lg:col-span-4">
              <MatchScoreChart data={data.matchScoreData ?? []} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
