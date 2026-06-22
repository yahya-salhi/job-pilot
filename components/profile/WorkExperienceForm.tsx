"use client";

import type { ProfileFormData, ProfileOnChange, WorkExperience } from "@/types";

type Props = {
  form: ProfileFormData;
  onChange: ProfileOnChange;
};

const EMPTY_EXPERIENCE: WorkExperience = {
  company: "",
  title: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  responsibilities: "",
};

export function WorkExperienceForm({ form, onChange }: Props) {
  const updateExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean
  ) => {
    const updated = form.workExperience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange("workExperience", updated);
  };

  const addRole = () => {
    if (form.workExperience.length >= 3) return;
    onChange("workExperience", [...form.workExperience, { ...EMPTY_EXPERIENCE }]);
  };

  const removeRole = (index: number) => {
    onChange(
      "workExperience",
      form.workExperience.filter((_, i) => i !== index)
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">Work Experience</h4>
        {form.workExperience.length < 3 && (
          <button
            type="button"
            onClick={addRole}
            className="text-accent text-xs font-semibold flex items-center gap-1 hover:text-accent-dark transition-colors"
          >
            <span className="text-base leading-none">+</span> Add role
          </button>
        )}
      </div>

      {form.workExperience.length === 0 && (
        <p className="text-sm text-text-muted">
          No roles added yet.{" "}
          <button
            type="button"
            onClick={addRole}
            className="text-accent font-bold hover:underline"
          >
            Add your first role
          </button>
        </p>
      )}

      {form.workExperience.map((exp, i) => (
        <div
          key={i}
          className="border border-border rounded-xl p-6 space-y-6 bg-surface-secondary"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Role {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeRole(i)}
              className="text-text-muted hover:text-error text-xs font-medium transition-colors"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor={`company-${i}`}
                className="text-xs font-normal text-text-muted uppercase tracking-wider"
              >
                Company Name
              </label>
              <input
                id={`company-${i}`}
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(i, "company", e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`job-title-${i}`}
                className="text-xs font-normal text-text-muted uppercase tracking-wider"
              >
                Job Title
              </label>
              <input
                id={`job-title-${i}`}
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(i, "title", e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`start-date-${i}`}
                className="text-xs font-normal text-text-muted uppercase tracking-wider"
              >
                Start Date
              </label>
              <input
                id={`start-date-${i}`}
                type="text"
                value={exp.startDate}
                onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                placeholder="E.g. January 2022"
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`end-date-${i}`}
                  className="text-xs font-normal text-text-muted uppercase tracking-wider"
                >
                  End Date
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id={`currently-working-${i}`}
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      updateExperience(i, "currentlyWorking", e.target.checked)
                    }
                    className="w-3.5 h-3.5 rounded-sm accent-accent cursor-pointer"
                  />
                  <label
                    htmlFor={`currently-working-${i}`}
                    className="text-xs font-medium text-text-secondary cursor-pointer"
                  >
                    Currently working here
                  </label>
                </div>
              </div>
              <input
                id={`end-date-${i}`}
                type="text"
                value={exp.endDate}
                onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                disabled={exp.currentlyWorking}
                placeholder={exp.currentlyWorking ? "Present" : "E.g. March 2024"}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor={`responsibilities-${i}`}
                className="text-xs font-normal text-text-muted uppercase tracking-wider"
              >
                Key Responsibilities
              </label>
              <textarea
                id={`responsibilities-${i}`}
                rows={3}
                value={exp.responsibilities}
                onChange={(e) =>
                  updateExperience(i, "responsibilities", e.target.value)
                }
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary resize-none focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
