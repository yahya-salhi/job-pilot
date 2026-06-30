"use client";

import type { ProfileFormData, ProfileOnChange } from "@/types";
import {
  REMOTE_PREFERENCES,
  REMOTE_PREFERENCE_LABELS,
  COVER_LETTER_TONES,
  COVER_LETTER_TONE_LABELS,
  type RemotePreference,
  type CoverLetterTone,
} from "@/constants/profile-constants";

type Props = {
  form: ProfileFormData;
  onChange: ProfileOnChange;
};

export function JobPreferencesForm({ form, onChange }: Props) {
  return (
    <section className="space-y-6">
      <h4 className="text-sm font-semibold text-text-primary">Job Preferences</h4>
      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="titles-seeking"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Job Titles Seeking
          </label>
          <input
            id="titles-seeking"
            type="text"
            value={form.jobTitlesSeeking}
            onChange={(e) => onChange("jobTitlesSeeking", e.target.value)}
            placeholder="E.g. Frontend Engineer, React Developer"
            className="w-full bg-surface border border-border rounded-md px-3 py-2.5 lg:py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="remote-pref"
              className="text-xs font-normal text-text-muted uppercase tracking-wider"
            >
              Remote Preference
            </label>
            <div className="relative">
              <select
                id="remote-pref"
                value={form.remotePreference}
                onChange={(e) => onChange("remotePreference", e.target.value as RemotePreference)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2.5 lg:py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              >
                {REMOTE_PREFERENCES.map((value) => (
                  <option key={value} value={value}>
                    {REMOTE_PREFERENCE_LABELS[value]}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="salary-exp"
              className="text-xs font-normal text-text-muted uppercase tracking-wider"
            >
              Salary Expectation (Optional)
            </label>
            <input
              id="salary-exp"
              type="text"
              value={form.salaryExpectation}
              onChange={(e) => onChange("salaryExpectation", e.target.value)}
              placeholder="E.g. $120k+"
              className="w-full bg-surface border border-border rounded-md px-3 py-2.5 lg:py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="pref-locations"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Preferred Locations (Optional)
          </label>
          <input
            id="pref-locations"
            type="text"
            value={form.preferredLocations}
            onChange={(e) => onChange("preferredLocations", e.target.value)}
            placeholder="E.g. New York, London"
            className="w-full bg-surface border border-border rounded-md px-3 py-2.5 lg:py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="cover-letter-tone"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Cover Letter Tone
          </label>
          <div className="relative">
            <select
              id="cover-letter-tone"
              value={form.coverLetterTone}
                onChange={(e) => onChange("coverLetterTone", e.target.value as CoverLetterTone)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2.5 lg:py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            >
              {COVER_LETTER_TONES.map((value) => (
                <option key={value} value={value}>
                  {COVER_LETTER_TONE_LABELS[value]}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
