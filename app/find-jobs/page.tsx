import { Suspense } from "react";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Footer } from "@/components/layout/Footer";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsTable } from "@/components/find-jobs/JobsTable";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";
import type { JobRow } from "@/types/job";
import { MATCH_THRESHOLD } from "@/constants/job-scoring";

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

  let jobs: JobRow[] = [];
  let totalItems = 0;

  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    if (authData?.user) {
      let query = insforge.database
        .from("jobs")
        .select(
          "id, company, title, match_score, salary, source, found_at, location, job_type, about_role, matched_skills, missing_skills, match_reason, source_url, external_apply_url",
          { count: "exact" },
        )
        .eq("user_id", authData.user.id);

      if (filter === "high") {
        query = query.gte("match_score", MATCH_THRESHOLD);
      } else if (filter === "low") {
        query = query.lt("match_score", MATCH_THRESHOLD);
      }

      if (search) {
        query = query.or(
          `company.ilike.%${search}%,title.ilike.%${search}%`,
        );
      }

      if (sort === "newest") {
        query = query.order("found_at", { ascending: false });
      } else if (sort === "oldest") {
        query = query.order("found_at", { ascending: true });
      } else {
        query = query.order("match_score", { ascending: false });
      }

      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;
      query = query.range(start, end);

      const { data, count } = await query;
      jobs = (data ?? []) as unknown as JobRow[];
      totalItems = count ?? 0;
    }
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
