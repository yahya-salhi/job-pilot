export const EXPERIENCE_LEVELS = ["junior", "mid", "senior", "lead"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const WORK_AUTHORIZATIONS = [
  "citizen",
  "permanent_resident",
  "visa_required",
] as const;
export type WorkAuthorization = (typeof WORK_AUTHORIZATIONS)[number];

export const REMOTE_PREFERENCES = ["any", "remote", "onsite", "hybrid"] as const;
export type RemotePreference = (typeof REMOTE_PREFERENCES)[number];

export const COVER_LETTER_TONES = [
  "formal",
  "casual",
  "enthusiastic",
] as const;
export type CoverLetterTone = (typeof COVER_LETTER_TONES)[number];

export const DEGREES = [
  "",
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
] as const;
export type Degree = (typeof DEGREES)[number];

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead / Manager",
};

export const WORK_AUTHORIZATION_LABELS: Record<WorkAuthorization, string> = {
  citizen: "Citizen",
  permanent_resident: "Permanent Resident",
  visa_required: "Requires Sponsorship",
};

export const REMOTE_PREFERENCE_LABELS: Record<RemotePreference, string> = {
  any: "Any",
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

export const COVER_LETTER_TONE_LABELS: Record<CoverLetterTone, string> = {
  formal: "Formal",
  casual: "Casual",
  enthusiastic: "Enthusiastic",
};

export const DEGREE_LABELS: Record<Degree, string> = {
  "": "Select degree",
  "High School": "High School",
  "Bachelor's": "Bachelor's",
  "Master's": "Master's",
  PhD: "PhD",
};

export const EXPERIENCE_LEVELS_SET = new Set<string>(EXPERIENCE_LEVELS);
export const WORK_AUTHORIZATIONS_SET = new Set<string>(WORK_AUTHORIZATIONS);
export const REMOTE_PREFERENCES_SET = new Set<string>(REMOTE_PREFERENCES);
export const COVER_LETTER_TONES_SET = new Set<string>(COVER_LETTER_TONES);
