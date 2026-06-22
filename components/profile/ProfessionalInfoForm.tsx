"use client";

import { useState } from "react";
import type { ProfileFormData, ProfileOnChange } from "@/types";

type Props = {
  form: ProfileFormData;
  onChange: ProfileOnChange;
};

export function ProfessionalInfoForm({ form, onChange }: Props) {
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      onChange("skills", [...form.skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    onChange(
      "skills",
      form.skills.filter((s) => s !== skill)
    );
  };

  const handleAddIndustry = () => {
    const trimmed = industryInput.trim();
    if (trimmed && !form.industries.includes(trimmed)) {
      onChange("industries", [...form.industries, trimmed]);
    }
    setIndustryInput("");
  };

  const handleRemoveIndustry = (industry: string) => {
    onChange(
      "industries",
      form.industries.filter((i) => i !== industry)
    );
  };

  return (
    <section className="space-y-6">
      <h4 className="text-sm font-semibold text-text-primary">Professional Info</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="current-title"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Current/Recent Job Title
          </label>
          <input
            id="current-title"
            type="text"
            value={form.currentTitle}
            onChange={(e) => onChange("currentTitle", e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="exp-level"
              className="text-xs font-normal text-text-muted uppercase tracking-wider"
            >
              Experience Level
            </label>
            <div className="relative">
              <select
                id="exp-level"
                value={form.experienceLevel}
                onChange={(e) => onChange("experienceLevel", e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Manager</option>
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
              htmlFor="years-exp"
              className="text-xs font-normal text-text-muted uppercase tracking-wider"
            >
              Years of Experience
            </label>
            <input
              id="years-exp"
              type="number"
              min="0"
              value={form.yearsExperience}
              onChange={(e) => onChange("yearsExperience", e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="skills-input"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Skills
          </label>
          <div className="flex gap-2">
            <input
              id="skills-input"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add a skill"
              className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium text-text-dark hover:bg-surface-secondary transition-colors"
            >
              Add
            </button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-border rounded-md text-xs font-medium text-text-primary flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-text-muted hover:text-error transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="industries-input"
            className="text-xs font-normal text-text-muted uppercase tracking-wider"
          >
            Industries Worked In (Optional)
          </label>
          <div className="flex gap-2">
            <input
              id="industries-input"
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddIndustry();
                }
              }}
              placeholder="E.g. FinTech, Healthcare"
              className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
            <button
              type="button"
              onClick={handleAddIndustry}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium text-text-dark hover:bg-surface-secondary transition-colors"
            >
              Add
            </button>
          </div>
          {form.industries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.industries.map((industry, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-border rounded-md text-xs font-medium text-text-primary flex items-center gap-1.5"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => handleRemoveIndustry(industry)}
                    className="text-text-muted hover:text-error transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
