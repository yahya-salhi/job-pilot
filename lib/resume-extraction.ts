import "@/lib/pdf-parse-setup";
import { PDFParse } from "pdf-parse";
import type { Education, WorkExperience } from "@/types";
import type { ExtractedProfilePatch } from "@/lib/merge-profile-extraction";

export type { ExtractedProfilePatch } from "@/lib/merge-profile-extraction";

const MIN_RESUME_TEXT_LENGTH = 100;

const EXPERIENCE_LEVELS = new Set(["junior", "mid", "senior", "lead"]);
const WORK_AUTHORIZATIONS = new Set([
  "citizen",
  "permanent_resident",
  "visa_required",
]);
const REMOTE_PREFERENCES = new Set(["remote", "onsite", "hybrid", "any"]);
const COVER_LETTER_TONES = new Set(["formal", "casual", "enthusiastic"]);

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

export function isResumeTextSufficient(text: string): boolean {
  return text.length >= MIN_RESUME_TEXT_LENGTH;
}

export function parseExtractedProfile(
  raw: unknown,
): ExtractedProfilePatch | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const data = raw as Record<string, unknown>;
  const patch: ExtractedProfilePatch = {};

  const fullName = asNonEmptyString(data.fullName);
  if (fullName) patch.fullName = fullName;

  const phone = asNonEmptyString(data.phone);
  if (phone) patch.phone = phone;

  const location = asNonEmptyString(data.location);
  if (location) patch.location = location;

  const linkedinUrl = asNonEmptyString(data.linkedinUrl);
  if (linkedinUrl) patch.linkedinUrl = linkedinUrl;

  const portfolioUrl = asNonEmptyString(data.portfolioUrl);
  if (portfolioUrl) patch.portfolioUrl = portfolioUrl;

  const workAuthorization = asEnum(data.workAuthorization, WORK_AUTHORIZATIONS);
  if (workAuthorization) patch.workAuthorization = workAuthorization;

  const currentTitle = asNonEmptyString(data.currentTitle);
  if (currentTitle) patch.currentTitle = currentTitle;

  const experienceLevel = asEnum(data.experienceLevel, EXPERIENCE_LEVELS);
  if (experienceLevel) patch.experienceLevel = experienceLevel;

  const yearsExperience = asNonEmptyString(data.yearsExperience);
  if (yearsExperience) patch.yearsExperience = yearsExperience;

  const skills = asStringArray(data.skills);
  if (skills.length > 0) patch.skills = skills;

  const industries = asStringArray(data.industries);
  if (industries.length > 0) patch.industries = industries;

  const workExperience = asWorkExperienceArray(data.workExperience);
  if (workExperience.length > 0) patch.workExperience = workExperience;

  const education = asEducation(data.education);
  if (education) patch.education = education;

  const jobTitlesSeeking = asNonEmptyString(data.jobTitlesSeeking);
  if (jobTitlesSeeking) patch.jobTitlesSeeking = jobTitlesSeeking;

  const remotePreference = asEnum(data.remotePreference, REMOTE_PREFERENCES);
  if (remotePreference) patch.remotePreference = remotePreference;

  const salaryExpectation = asNonEmptyString(data.salaryExpectation);
  if (salaryExpectation) patch.salaryExpectation = salaryExpectation;

  const preferredLocations = asNonEmptyString(data.preferredLocations);
  if (preferredLocations) patch.preferredLocations = preferredLocations;

  const coverLetterTone = asEnum(data.coverLetterTone, COVER_LETTER_TONES);
  if (coverLetterTone) patch.coverLetterTone = coverLetterTone;

  return Object.keys(patch).length > 0 ? patch : null;
}

export function buildResumeExtractionPrompt(resumeText: string): string {
  return `Extract structured profile data from this resume text. Return ONLY valid JSON matching this shape. CRITICAL: If you cannot confidently find a value, OMIT the field entirely — do NOT guess, invent, or return placeholder text.

{
  "fullName": "string (the person's actual first and last name — NEVER a job title)",
  "phone": "string",
  "location": "string",
  "linkedinUrl": "string (must be a full URL like https://linkedin.com/in/... or omit)",
  "portfolioUrl": "string (must be a full URL, or omit)",
  "workAuthorization": "citizen | permanent_resident | visa_required",
  "currentTitle": "string (most recent job title)",
  "experienceLevel": "junior | mid | senior | lead",
  "yearsExperience": "string (number as string, e.g. \"5\" or \"10+\")",
  "skills": ["string"],
  "industries": ["string"],
  "workExperience": [{
    "company": "string",
    "title": "string",
    "startDate": "string",
    "endDate": "string",
    "currentlyWorking": boolean,
    "responsibilities": "string"
  }],
  "education": {
    "degree": "string",
    "field": "string",
    "institution": "string",
    "graduationYear": "string"
  },
  "jobTitlesSeeking": "string (comma-separated roles)",
  "remotePreference": "remote | onsite | hybrid | any",
  "salaryExpectation": "string",
  "preferredLocations": "string (comma-separated)",
  "coverLetterTone": "formal | casual | enthusiastic"
}

Rules:
- fullName MUST be the person's actual name (e.g. "John Smith"), NEVER a job title or headline.
- linkedinUrl and portfolioUrl MUST be valid full URLs or be omitted entirely.
- Do not include email.
- Include up to 3 work experience entries, most recent first.
- Use enum values exactly as listed.
- Infer experienceLevel and yearsExperience from work history when possible.
- If unsure about workAuthorization, remotePreference, or coverLetterTone, omit them.
- When in doubt, OMIT the field. Never return placeholder text like "LinkedIn" or "Portfolio".

RESUME TEXT:
${resumeText}`;
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asEnum(value: unknown, allowed: Set<string>): string | null {
  if (typeof value !== "string") return null;
  return allowed.has(value) ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asWorkExperienceArray(value: unknown): WorkExperience[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const role = item as Record<string, unknown>;
      const company = asNonEmptyString(role.company);
      const title = asNonEmptyString(role.title);
      const startDate = asNonEmptyString(role.startDate) ?? "";
      const endDate = asNonEmptyString(role.endDate) ?? "";
      const responsibilities = asNonEmptyString(role.responsibilities) ?? "";
      const currentlyWorking = role.currentlyWorking === true;

      if (!company || !title) return null;

      return {
        company,
        title,
        startDate,
        endDate,
        currentlyWorking,
        responsibilities,
      };
    })
    .filter((item): item is WorkExperience => item !== null)
    .slice(0, 3);
}

function asEducation(value: unknown): Education | null {
  if (!value || typeof value !== "object") return null;

  const edu = value as Record<string, unknown>;
  const degree = asNonEmptyString(edu.degree) ?? "";
  const field = asNonEmptyString(edu.field) ?? "";
  const institution = asNonEmptyString(edu.institution) ?? "";
  const graduationYear = asNonEmptyString(edu.graduationYear) ?? "";

  if (!degree && !field && !institution && !graduationYear) {
    return null;
  }

  return { degree, field, institution, graduationYear };
}
