import { manualResumePath, generatedResumePath, RESUMES_BUCKET } from "@/lib/storage-paths";

type InsforgeClient = Awaited<ReturnType<typeof import("../lib/insforge-server").createInsforgeServer>>;

export type FileResult =
  | { success: true; buffer: Uint8Array; filename: string }
  | { success: false; error: string; status: number };

function inferStoragePath(userId: string, resumePdfUrl: string): string {
  const isGenerated = resumePdfUrl.includes("resume-generated.pdf");
  return isGenerated ? generatedResumePath(userId) : manualResumePath(userId);
}

export async function getResumeFilePipeline(
  insforge: InsforgeClient,
  userId: string,
): Promise<FileResult> {
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("resume_pdf_url, resume_storage_key")
    .eq("id", userId)
    .single();

  if (!profile?.resume_pdf_url) {
    return {
      success: false,
      error: "No resume found. Upload or generate one first.",
      status: 404,
    };
  }

  const storagePath =
    profile.resume_storage_key ?? inferStoragePath(userId, profile.resume_pdf_url);

  const { data: fileBlob, error: downloadError } = await insforge.storage
    .from(RESUMES_BUCKET)
    .download(storagePath);

  if (downloadError || !fileBlob) {
    return {
      success: false,
      error: "Resume not found.",
      status: 404,
    };
  }

  const buffer = new Uint8Array(await fileBlob.arrayBuffer());

  return { success: true, buffer, filename: "resume.pdf" };
}
