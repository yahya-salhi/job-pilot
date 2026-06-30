import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createInsforgeServer } from "@/lib/insforge-server";
import { JobInfo } from "@/components/job-details/JobInfo";
import { MatchScore } from "@/components/job-details/MatchScore";
import { JobDescription } from "@/components/job-details/JobDescription";
import { CompanyResearch } from "@/components/job-details/CompanyResearch";
import { JobActions } from "@/components/job-details/JobActions";
import { Footer } from "@/components/layout/Footer";
import type { JobDetail } from "@/types/job";
import { getJobById } from "@/data/jobs-repo";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let job: JobDetail | null = null;

  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    if (!authData?.user) redirect("/login");

    job = await getJobById(insforge, id, authData.user.id);

    if (!job) {
      notFound();
    }
  } catch (error) {
    console.error("[job-details]", error);
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow px-4 md:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
          <Link
            href="/find-jobs"
            className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          <JobInfo
            title={job.title}
            company={job.company}
            matchScore={job.match_score}
            externalApplyUrl={job.external_apply_url}
            salary={job.salary}
            location={job.location}
            jobType={job.job_type}
            foundAt={job.found_at}
          />

          <MatchScore
            matchReason={job.match_reason}
            matchedSkills={job.matched_skills}
            missingSkills={job.missing_skills}
          />

          <JobDescription
            aboutRole={job.about_role}
            responsibilities={job.responsibilities}
            requirements={job.requirements}
            niceToHave={job.nice_to_have}
            benefits={job.benefits}
            aboutCompany={job.about_company}
          />

          <CompanyResearch
            jobId={job.id}
            company={job.company}
            companyResearch={job.company_research}
          />

          <JobActions externalApplyUrl={job.external_apply_url} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
