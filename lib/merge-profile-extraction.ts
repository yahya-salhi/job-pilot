import type { Education, ProfileFormData, WorkExperience } from "@/types";

export type ExtractedProfilePatch = Partial<
  Omit<ProfileFormData, "email" | "resumePdfUrl">
>;

export function mergeProfileExtraction(
  current: ProfileFormData,
  initial: ProfileFormData,
  extracted: ExtractedProfilePatch,
): ProfileFormData {
  const merged: ProfileFormData = { ...current };

  const stringFields = [
    "fullName",
    "phone",
    "location",
    "linkedinUrl",
    "portfolioUrl",
    "currentTitle",
    "yearsExperience",
    "jobTitlesSeeking",
    "salaryExpectation",
    "preferredLocations",
  ] as const;

  for (const field of stringFields) {
    const value = extracted[field];
    if (typeof value === "string" && shouldApplyString(current[field], initial[field])) {
      merged[field] = value;
    }
  }

  const enumFields = [
    "workAuthorization",
    "experienceLevel",
    "remotePreference",
    "coverLetterTone",
  ] as const;

  for (const field of enumFields) {
    const value = extracted[field];
    if (typeof value === "string" && current[field] === initial[field]) {
      merged[field] = value;
    }
  }

  if (
    extracted.skills &&
    (current.skills.length === 0 ||
      arraysEqual(current.skills, initial.skills))
  ) {
    merged.skills = extracted.skills;
  }

  if (
    extracted.industries &&
    (current.industries.length === 0 ||
      arraysEqual(current.industries, initial.industries))
  ) {
    merged.industries = extracted.industries;
  }

  if (
    extracted.workExperience &&
    (current.workExperience.length === 0 ||
      workExperienceEqual(current.workExperience, initial.workExperience))
  ) {
    merged.workExperience = extracted.workExperience.slice(0, 3);
  }

  if (extracted.education) {
    merged.education = mergeEducation(
      current.education,
      initial.education,
      extracted.education,
    );
  }

  return merged;
}

function shouldApplyString(current: string, initial: string): boolean {
  return current.trim() === "" || current === initial;
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function workExperienceEqual(
  a: WorkExperience[],
  b: WorkExperience[],
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function mergeEducation(
  current: Education,
  initial: Education,
  extracted: Education,
): Education {
  return {
    degree: shouldApplyString(current.degree, initial.degree)
      ? extracted.degree || current.degree
      : current.degree,
    field: shouldApplyString(current.field, initial.field)
      ? extracted.field || current.field
      : current.field,
    institution: shouldApplyString(current.institution, initial.institution)
      ? extracted.institution || current.institution
      : current.institution,
    graduationYear: shouldApplyString(
      current.graduationYear,
      initial.graduationYear,
    )
      ? extracted.graduationYear || current.graduationYear
      : current.graduationYear,
  };
}
