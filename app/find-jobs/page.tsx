import { Suspense } from "react";
import { requireAuthenticatedPage } from "@/lib/require-user";
import { Footer } from "@/components/layout/Footer";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsTable } from "@/components/find-jobs/JobsTable";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";
import type { JobRow } from "@/types/job";
import { getJobsPaginated } from "@/data/jobs-repo";

const PAGE_SIZE = 20;

type SearchParams = {
  page?: string;
  filter?: string;
  sort?: string;
  search?: string;
};

export default async function FindJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const filter = params.filter || "all";
  const sort = params.sort || "match_score";
  const search = (params.search || "").trim();

  const { user, insforge } = await requireAuthenticatedPage();
  let jobs: JobRow[] = [];
  let totalItems = 0;

  try {
    const result = await getJobsPaginated(insforge, {
      userId: user.id,
      page: currentPage,
      pageSize: PAGE_SIZE,
      filter,
      sort,
      search,
    });
    jobs = result.jobs;
    totalItems = result.total;
  } catch (error) {
    console.error("[find-jobs]", error);
  }

  const qsParams = new URLSearchParams();
  if (filter !== "all") qsParams.set("filter", filter);
  if (sort !== "match_score") qsParams.set("sort", sort);
  if (search) qsParams.set("search", search);
  const searchParamsString = qsParams.toString();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-text-primary">Find Jobs</h1>
          <SearchControls />
          <Suspense fallback={<div className="h-10" />}>
            <JobFilters />
          </Suspense>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            {jobs.length > 0 ? (
              <>
                <JobsTable jobs={jobs} />
                <JobsPagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  pageSize={PAGE_SIZE}
                  basePath="/find-jobs"
                  searchParamsString={searchParamsString}
                />
              </>
            ) : (
              <p className="text-sm text-text-secondary text-center py-12">
                {search || filter !== "all"
                  ? "No jobs match your current filters. Try adjusting your search criteria."
                  : "No jobs found yet. Use the search above to find jobs matching your profile."}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
