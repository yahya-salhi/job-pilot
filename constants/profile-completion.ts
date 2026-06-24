import type { ProfileFormData } from "@/types";

export type ProfileFieldCheck = {
  label: string;
  check: (data: ProfileFormData) => boolean;
};

export const PROFILE_REQUIRED_FIELD_CHECKS: ProfileFieldCheck[] = [
  { label: "NAME", check: (f) => f.fullName.trim().length > 0 },
  { label: "EMAIL", check: (f) => f.email.trim().length > 0 },
  { label: "PHONE", check: (f) => f.phone.trim().length > 0 },
  { label: "LOCATION", check: (f) => f.location.trim().length > 0 },
  { label: "WORK AUTH", check: (f) => f.workAuthorization.length > 0 },
  { label: "TITLE", check: (f) => f.currentTitle.trim().length > 0 },
  { label: "EXP LEVEL", check: (f) => f.experienceLevel.length > 0 },
  { label: "YEARS EXP", check: (f) => f.yearsExperience.trim().length > 0 },
  { label: "SKILLS", check: (f) => f.skills.length > 0 },
  {
    label: "WORK HISTORY",
    check: (f) =>
      f.workExperience.length > 0 &&
      f.workExperience.some(
        (e) =>
          e.company.trim().length > 0 &&
          e.title.trim().length > 0 &&
          e.startDate.trim().length > 0 &&
          e.responsibilities.trim().length > 0,
      ),
  },
  { label: "DEGREE", check: (f) => f.education.degree.trim().length > 0 },
  { label: "FIELD OF STUDY", check: (f) => f.education.field.trim().length > 0 },
  { label: "INSTITUTION", check: (f) => f.education.institution.trim().length > 0 },
  { label: "TITLES SEEKING", check: (f) => f.jobTitlesSeeking.trim().length > 0 },
  { label: "REMOTE PREF", check: (f) => f.remotePreference.length > 0 },
  { label: "TONE", check: (f) => f.coverLetterTone.length > 0 },
];

export function getProfileCompletion(data: ProfileFormData): {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
} {
  const results = PROFILE_REQUIRED_FIELD_CHECKS.map((item) => ({
    label: item.label,
    ok: item.check(data),
  }));
  const filled = results.filter((r) => r.ok).length;
  const total = results.length;

  return {
    percentage: total === 0 ? 0 : Math.round((filled / total) * 100),
    missingFields: results.filter((r) => !r.ok).map((r) => r.label),
    isComplete: filled === total,
  };
}

export function computeIsComplete(data: ProfileFormData): boolean {
  return getProfileCompletion(data).isComplete;
}
