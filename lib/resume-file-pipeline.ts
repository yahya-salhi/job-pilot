type InsforgeClient = Awaited<ReturnType<typeof import("./insforge-server").createInsforgeServer>>;

export type FileResult =
  | { success: true; buffer: Uint8Array; filename: string }
  | { success: false; error: string; status: number };

export async function getResumeFilePipeline(
  insforge: InsforgeClient,
  userId: string,
): Promise<FileResult> {
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("resume_pdf_url")
    .eq("id", userId)
    .single();

  if (!profile?.resume_pdf_url) {
    return {
      success: false,
      error: "No resume found. Upload or generate one first.",
      status: 404,
    };
  }

  const isGenerated = profile.resume_pdf_url.includes("resume-generated.pdf");
  const filename = isGenerated ? "resume-generated.pdf" : "resume.pdf";
  const storagePath = `${userId}/${filename}`;

  const { data: fileBlob, error: downloadError } = await insforge.storage
    .from("resumes")
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
