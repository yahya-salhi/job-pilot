"use server";

import { revalidatePath } from "next/cache";
import { requireUser, AuthError } from "@/lib/require-user";
import { computeIsComplete } from "@/lib/profile-completion";
import { validateResumeFile } from "@/lib/resume-upload";
import { formToDb } from "@/lib/profile-mapper";
import { manualResumePath, RESUMES_BUCKET } from "@/lib/storage-paths";
import type { ProfileFormData } from "@/types";

export async function saveProfile(formData: ProfileFormData) {
  try {
    const { user, insforge } = await requireUser();

    const isComplete = computeIsComplete(formData);

    const profileRecord = formToDb(formData, user.id, isComplete);

    const { error } = await insforge.database
      .from("profiles")
      .upsert([profileRecord], { ignoreDuplicates: false })
      .select()
      .single();

    if (error) {
      console.error("[actions/profile] upsert error:", error);
      return { success: false, error: "Failed to save profile." };
    }

    revalidatePath("/profile");
    return { success: true, isComplete };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }

    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to save profile." };
  }
}

export async function uploadResume(formData: FormData) {
  try {
    const { user, insforge } = await requireUser();

    const fileEntry = formData.get("file");
    if (!(fileEntry instanceof File)) {
      return { success: false, error: "No file provided." };
    }

    const validationError = validateResumeFile(fileEntry);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const storagePath = manualResumePath(user.id);
    const { data, error } = await insforge.storage
      .from(RESUMES_BUCKET)
      .upload(storagePath, fileEntry);

    if (error || !data?.url) {
      console.error("[actions/profile] upload error:", error);
      return { success: false, error: "Failed to upload resume." };
    }

    return { success: true, url: data.url, key: storagePath };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }

    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to upload resume." };
  }
}
