import { MapPin, Briefcase, Calendar, DollarSign } from "lucide-react";

type Props = {
  title: string | null;
  company: string | null;
  matchScore: number | null;
  externalApplyUrl: string | null;
  salary: string | null;
  location: string | null;
  jobType: string | null;
  foundAt: string;
};

function ScoreBadge({ score }: { score: number }) {
  let bg: string;
  let text: string;
  if (score >= 80) {
    bg = "bg-success-lightest";
    text = "text-success-foreground";
  } else if (score >= 60) {
    bg = "bg-info-lightest";
    text = "text-info-foreground";
  } else {
    bg = "bg-surface-secondary";
    text = "text-text-secondary";
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {score}% Match
    </span>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-accent-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-text-primary mt-0.5 truncate">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export function JobInfo({ title, company, matchScore, externalApplyUrl, salary, location, jobType, foundAt }: Props) {
  const dateFormatted = foundAt
    ? new Date(foundAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center shrink-0">
          <Briefcase className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-text-primary truncate">{title ?? "Untitled Position"}</h1>
            {matchScore !== null && <ScoreBadge score={matchScore} />}
          </div>
          <p className="text-sm text-text-secondary mt-1">{company ?? "Unknown Company"}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {externalApplyUrl && (
            <a
              href={externalApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground font-medium text-sm px-4 py-2 rounded-md hover:bg-accent-dark transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              View Job Post
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <InfoCard icon={DollarSign} label="Salary Est." value={salary} />
        <InfoCard icon={MapPin} label="Location" value={location} />
        <InfoCard icon={Briefcase} label="Job Type" value={jobType ? jobType.charAt(0).toUpperCase() + jobType.slice(1) : null} />
        <InfoCard icon={Calendar} label="Date Found" value={dateFormatted} />
      </div>
    </div>
  );
}
