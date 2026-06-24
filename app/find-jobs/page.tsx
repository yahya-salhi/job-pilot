import { createInsforgeServer } from "@/lib/insforge-server";
import { Footer } from "@/components/layout/Footer";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsTable } from "@/components/find-jobs/JobsTable";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";
import type { JobRow } from "@/types/job";

const PAGE_SIZE = 6;

export default async function FindJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  let jobs: JobRow[] = [];
  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    if (authData?.user) {
      const { data } = await insforge.database
        .from("jobs")
        .select("id, company, title, match_score, salary, source, found_at, location, job_type, about_role, matched_skills, missing_skills, match_reason, source_url, external_apply_url")
        .eq("user_id", authData.user.id)
        .order("found_at", { ascending: false });

      jobs = (data ?? []) as unknown as JobRow[];
    }
  } catch {
  }

  const totalItems = jobs.length;
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleJobs = jobs.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">Find Jobs</h1>
          <SearchControls />
          <JobFilters />
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            {visibleJobs.length > 0 ? (
              <>
                <JobsTable jobs={visibleJobs} />
                <JobsPagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  pageSize={PAGE_SIZE}
                  basePath="/find-jobs"
                />
              </>
            ) : (
              <p className="text-sm text-text-secondary text-center py-12">
                No jobs found yet. Use the search above to find jobs matching your profile.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
