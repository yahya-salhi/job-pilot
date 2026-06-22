const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const PDF_MIME_TYPES = new Set(["application/pdf"]);

export function validateResumeFile(file: File): string | null {
  const isPdfMime = PDF_MIME_TYPES.has(file.type);
  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");

  if (!isPdfMime && !hasPdfExtension) {
    return "Only PDF files are allowed.";
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "File size must be 5MB or less.";
  }

  if (file.size === 0) {
    return "The selected file is empty.";
  }

  return null;
}
