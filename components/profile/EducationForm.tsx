"use client";

import type { ProfileFormData, ProfileOnChange } from "@/types";

type Props = {
  form: ProfileFormData;
  onChange: ProfileOnChange;
};

export function EducationForm({ form, onChange }: Props) {
  const updateEducation = (
    field: keyof ProfileFormData["education"],
    value: string
  ) => {
    onChange("education", { ...form.education, [field]: value });
  };

  return (
    <section className="space-y-6">
      <h4 className="text-sm font-semibold text-text-primary">Education</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-2">
          <label
            htmlFor="degree"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Highest Degree
          </label>
          <div className="relative">
            <select
              id="degree"
              value={form.education.degree}
              onChange={(e) => updateEducation("degree", e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            >
              <option value="">Select degree</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor&apos;s</option>
              <option value="Master's">Master&apos;s</option>
              <option value="PhD">PhD</option>
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
            htmlFor="field-of-study"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Field of Study
          </label>
          <input
            id="field-of-study"
            type="text"
            value={form.education.field}
            onChange={(e) => updateEducation("field", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="institution"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Institution Name
          </label>
          <input
            id="institution"
            type="text"
            value={form.education.institution}
            onChange={(e) => updateEducation("institution", e.target.value)}
            placeholder="E.g. State University"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="grad-year"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Graduation Year
          </label>
          <input
            id="grad-year"
            type="text"
            value={form.education.graduationYear}
            onChange={(e) => updateEducation("graduationYear", e.target.value)}
            placeholder="YYYY"
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
      </div>
    </section>
  );
}
