import type {
  WorkAuthorization,
  ExperienceLevel,
  RemotePreference,
  CoverLetterTone,
  Degree,
} from "@/lib/profile-constants";

export type WorkExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
};

export type Education = {
  degree: Degree;
  field: string;
  institution: string;
  graduationYear: string;
};

export type ProfileFormData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: WorkAuthorization;
  currentTitle: string;
  experienceLevel: ExperienceLevel;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperience: WorkExperience[];
  education: Education;
  jobTitlesSeeking: string;
  remotePreference: RemotePreference;
  salaryExpectation: string;
  preferredLocations: string;
  coverLetterTone: CoverLetterTone;
  resumePdfUrl: string;
};

export type ProfileOnChange = <K extends keyof ProfileFormData>(
  field: K,
  value: ProfileFormData[K]
) => void;
