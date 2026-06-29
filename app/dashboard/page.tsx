import { createInsforgeServer } from "@/lib/insforge-server";
import { Footer } from "@/components/layout/Footer";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Charts } from "@/components/dashboard/Charts";
import { IncompleteProfileBanner } from "@/components/dashboard/IncompleteProfileBanner";

export default async function DashboardPage() {
  let profileComplete = true;

  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    if (authData?.user) {
      const { data: profile } = await insforge.database
        .from("profiles")
        .select("is_complete")
        .eq("id", authData.user.id)
        .single();
      if (profile) {
        profileComplete = profile.is_complete ?? false;
      }
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

          <StatsBar />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
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
