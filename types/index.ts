export type WorkExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
};

export type Education = {
  degree: string;
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
  workAuthorization: string;
  currentTitle: string;
  experienceLevel: string;
  yearsExperience: string;
  skills: string[];
  industries: string[];
  workExperience: WorkExperience[];
  education: Education;
  jobTitlesSeeking: string;
  remotePreference: string;
  salaryExpectation: string;
  preferredLocations: string;
  coverLetterTone: string;
  resumePdfUrl: string;
};

export type ProfileOnChange = <K extends keyof ProfileFormData>(
  field: K,
  value: ProfileFormData[K]
) => void;
