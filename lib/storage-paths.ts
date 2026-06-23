export const RESUMES_BUCKET = "resumes";

export function manualResumePath(userId: string): string {
  return `${userId}/resume.pdf`;
}

export function generatedResumePath(userId: string): string {
  return `${userId}/resume-generated.pdf`;
}
