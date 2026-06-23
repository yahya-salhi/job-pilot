import type { ProfileFormData, WorkExperience, Education } from "@/types";

export type ProfileDbRow = {
  id?: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  work_authorization: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[] | null;
  industries: string[] | null;
  work_experience: WorkExperience[] | null;
  education: Education | null;
  job_titles_seeking: string[] | null;
  remote_preference: string | null;
  salary_expectation: string | null;
  preferred_locations: string[] | null;
  cover_letter_tone: string | null;
  resume_pdf_url: string | null;
  is_complete: boolean | null;
};

export type ProfileDbInsert = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  work_authorization: string;
  current_title: string;
  experience_level: string;
  years_experience: number | null;
  skills: string[];
  industries: string[];
  work_experience: WorkExperience[];
  education: Education;
  job_titles_seeking: string[];
  remote_preference: string;
  salary_expectation: string;
  preferred_locations: string[];
  cover_letter_tone: string;
  resume_pdf_url: string;
  is_complete: boolean;
};

const EMPTY_EDUCATION: Education = {
  degree: "",
  field: "",
  institution: "",
  graduationYear: "",
};

export function dbToForm(
  profile: ProfileDbRow | null,
  user?: { email?: string },
): ProfileFormData {
  return {
    fullName: profile?.full_name ?? "",
    email: profile?.email ?? user?.email ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    linkedinUrl: profile?.linkedin_url ?? "",
    portfolioUrl: profile?.portfolio_url ?? "",
    workAuthorization: profile?.work_authorization ?? "citizen",
    currentTitle: profile?.current_title ?? "",
    experienceLevel: profile?.experience_level ?? "junior",
    yearsExperience: profile?.years_experience?.toString() ?? "",
    skills: profile?.skills ?? [],
    industries: profile?.industries ?? [],
    workExperience: profile?.work_experience ?? [],
    education: profile?.education ?? { ...EMPTY_EDUCATION },
    jobTitlesSeeking: (profile?.job_titles_seeking ?? []).join(", "),
    remotePreference: profile?.remote_preference ?? "any",
    salaryExpectation: profile?.salary_expectation ?? "",
    preferredLocations: (profile?.preferred_locations ?? []).join(", "),
    coverLetterTone: profile?.cover_letter_tone ?? "formal",
    resumePdfUrl: profile?.resume_pdf_url ?? "",
  };
}

function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseYearsExperience(value: string): number | null {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function formToDb(
  formData: ProfileFormData,
  userId: string,
  isComplete: boolean,
): ProfileDbInsert {
  return {
    id: userId,
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    location: formData.location,
    linkedin_url: formData.linkedinUrl,
    portfolio_url: formData.portfolioUrl,
    work_authorization: formData.workAuthorization,
    current_title: formData.currentTitle,
    experience_level: formData.experienceLevel,
    years_experience: parseYearsExperience(formData.yearsExperience),
    skills: formData.skills,
    industries: formData.industries,
    work_experience: formData.workExperience,
    education: formData.education,
    job_titles_seeking: parseCommaList(formData.jobTitlesSeeking),
    remote_preference: formData.remotePreference,
    salary_expectation: formData.salaryExpectation,
    preferred_locations: parseCommaList(formData.preferredLocations),
    cover_letter_tone: formData.coverLetterTone,
    resume_pdf_url: formData.resumePdfUrl,
    is_complete: isComplete,
  };
}
