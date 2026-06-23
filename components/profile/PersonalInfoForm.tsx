"use client";

import type { ProfileFormData, ProfileOnChange } from "@/types";
import {
  WORK_AUTHORIZATIONS,
  WORK_AUTHORIZATION_LABELS,
  type WorkAuthorization,
} from "@/lib/profile-constants";

type Props = {
  form: ProfileFormData;
  onChange: ProfileOnChange;
};

export function PersonalInfoForm({ form, onChange }: Props) {
  return (
    <section className="space-y-6">
      <h4 className="text-sm font-semibold text-text-primary">Personal Info</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label
            htmlFor="full-name"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Full Name
          </label>
          <input
            id="full-name"
            type="text"
            value={form.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            disabled
            className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-sm text-text-primary cursor-not-allowed opacity-60 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="location"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={form.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="City, Country"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="linkedin"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            LinkedIn URL
          </label>
          <input
            id="linkedin"
            type="text"
            value={form.linkedinUrl}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="portfolio"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Portfolio / GitHub
          </label>
          <input
            id="portfolio"
            type="text"
            value={form.portfolioUrl}
            onChange={(e) => onChange("portfolioUrl", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="work-auth"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Work Authorization
          </label>
          <div className="relative">
            <select
              id="work-auth"
              value={form.workAuthorization}
              onChange={(e) => onChange("workAuthorization", e.target.value as WorkAuthorization)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            >
              {WORK_AUTHORIZATIONS.map((value) => (
                <option key={value} value={value}>
                  {WORK_AUTHORIZATION_LABELS[value]}
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
