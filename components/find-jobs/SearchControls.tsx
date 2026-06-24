"use client";

import { Search, Loader2, Briefcase, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FindResult = {
  success: boolean;
  totalFound: number;
  strongMatches: number;
  message?: string;
  error?: string;
};

export function SearchControls() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindResult | null>(null);

  const handleFindJobs = async () => {
    if (!jobTitle.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: jobTitle.trim(), location: location.trim() }),
      });

      const data: FindResult = await response.json();
      setResult(data);
      router.refresh();
    } catch {
      setResult({ success: false, totalFound: 0, strongMatches: 0, error: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-dark uppercase tracking-wider" htmlFor="job-title">
            Job Title
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="job-title"
              type="text"
              placeholder="Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-dark uppercase tracking-wider" htmlFor="location">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="location"
              type="text"
              placeholder="Remote, New York..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-text-primary placeholder-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleFindJobs}
        disabled={isLoading || !jobTitle.trim()}
        className="bg-accent text-accent-foreground font-medium text-sm px-4 py-2 rounded-md flex items-center gap-2 hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        {isLoading ? "Searching..." : "Find Jobs"}
      </button>

      {result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            result.success
              ? "bg-success-lightest border border-success-light text-success-foreground"
              : "bg-status-error-light border border-status-error text-status-error"
          }`}
        >
          {result.success
            ? result.message || `Found ${result.totalFound} jobs and saved ${result.strongMatches} strong matches.`
            : result.error || "Something went wrong. Please try again."}
        </div>
      )}
    </div>
  );
}
