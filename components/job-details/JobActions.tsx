import { ExternalLink, ArrowUpRight } from "lucide-react";

type Props = {
  externalApplyUrl: string | null;
};

export function JobActions({ externalApplyUrl }: Props) {
  if (!externalApplyUrl) return null;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <a
        href={externalApplyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-accent text-accent-foreground font-medium text-sm px-6 py-2.5 rounded-md hover:bg-accent-dark transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Apply Now
      </a>
      <a
        href={externalApplyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-surface text-text-secondary border border-border font-medium text-sm px-4 py-2.5 rounded-md hover:bg-surface-secondary transition-colors"
      >
        <ArrowUpRight className="w-4 h-4" />
        View Original Posting
      </a>
    </div>
  );
}
