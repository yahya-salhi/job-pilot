"use client";

import { useState } from "react";
import { Building2, Loader2, AlertCircle } from "lucide-react";
import type { CompanyResearch as CompanyResearchType } from "@/types/job";

type Props = {
  jobId: string;
  company: string | null;
  companyResearch: CompanyResearchType | null;
};

function DossierCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
      {children}
    </div>
  );
}

function BulletItems({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-text-secondary leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CompanyResearch({ jobId, company, companyResearch }: Props) {
  const [researching, setResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResearch() {
    setResearching(true);
    setError(null);

    try {
      const response = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Research failed. Please try again.");
        return;
      }

      window.location.reload();
    } catch {
      setError("Research failed. Please try again.");
    } finally {
      setResearching(false);
    }
  }

  if (companyResearch) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-text-primary">Company Research</h2>

        <DossierCard title="Company Overview">
          <p className="text-sm text-text-secondary leading-relaxed">{companyResearch.companyOverview}</p>
        </DossierCard>

        {companyResearch.techStack.length > 0 && (
          <DossierCard title="Tech Stack">
            <div className="flex flex-wrap gap-2">
              {companyResearch.techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-secondary text-text-dark">
                  {tech}
                </span>
              ))}
            </div>
          </DossierCard>
        )}

        <DossierCard title="Culture">
          <BulletItems items={companyResearch.culture} />
        </DossierCard>

        <DossierCard title="Why This Role">
          <p className="text-sm text-text-secondary leading-relaxed">{companyResearch.whyThisRole}</p>
        </DossierCard>

        <DossierCard title="Your Edge">
          <BulletItems items={companyResearch.yourEdge} />
        </DossierCard>

        <DossierCard title="Gaps to Address">
          <BulletItems items={companyResearch.gapsToAddress} />
        </DossierCard>

        <DossierCard title="Smart Questions">
          <BulletItems items={companyResearch.smartQuestions} />
        </DossierCard>

        <DossierCard title="Interview Prep">
          <BulletItems items={companyResearch.interviewPrep} />
        </DossierCard>

        {companyResearch.sources.length > 0 && (
          <DossierCard title="Sources">
            <ul className="space-y-0.5">
              {companyResearch.sources.map((src, i) => (
                <li key={i} className="text-xs text-text-muted">{src}</li>
              ))}
            </ul>
          </DossierCard>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Company Research</h2>
        <p className="text-sm text-text-secondary max-w-sm mb-4">
          Learn more about {company ?? "this company"} — tech stack, culture, interview prep, and how your profile fits.
        </p>
        {error && (
          <div className="flex items-center gap-2 text-sm text-error mb-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <button
          type="button"
          disabled={researching}
          onClick={handleResearch}
          className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground font-medium text-sm px-4 py-2 rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {researching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4" />
              Research Company
            </>
          )}
        </button>
      </div>
    </div>
  );
}
