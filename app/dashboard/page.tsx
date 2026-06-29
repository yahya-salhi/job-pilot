import { requireAuthenticatedPage } from "@/lib/require-user";
import { loadDashboardData, type DashboardData } from "@/lib/dashboard-data";
import { createAnalyticsService } from "@/lib/analytics";
import { Footer } from "@/components/layout/Footer";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>

          {!data.profileComplete && <IncompleteProfileBanner />}

          <StatsBar
            totalJobs={data.totalJobs}
            avgMatchRate={data.avgMatchRate}
            companiesResearched={data.companiesResearched}
            jobsThisWeek={data.jobsThisWeek}
          />

          <RecentActivity entries={data.activityEntries} />

          <AnalyticsCharts
            jobsFoundData={data.jobsFoundData ?? []}
            matchScoreData={data.matchScoreData ?? []}
            companyResearchData={data.companyResearchData ?? []}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
