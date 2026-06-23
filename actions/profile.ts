"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { computeIsComplete } from "@/lib/profile-completion";
import { validateResumeFile } from "@/lib/resume-upload";
import { formToDb } from "@/lib/profile-mapper";
import { manualResumePath, RESUMES_BUCKET } from "@/lib/storage-paths";
import type { ProfileFormData } from "@/types";

export async function saveProfile(formData: ProfileFormData) {
  try {
    const insforge = await createInsforgeServer();

    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return { success: false, error: "Please sign in to save your profile." };
    }

    const isComplete = computeIsComplete(formData);

    const profileRecord = formToDb(formData, authData.user.id, isComplete);

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
    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to save profile." };
  }
}

export async function uploadResume(formData: FormData) {
  try {
    const insforge = await createInsforgeServer();

    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return { success: false, error: "Please sign in to upload a resume." };
    }

    const fileEntry = formData.get("file");
    if (!(fileEntry instanceof File)) {
      return { success: false, error: "No file provided." };
    }

    const validationError = validateResumeFile(fileEntry);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const storagePath = manualResumePath(authData.user.id);
    const { data, error } = await insforge.storage
      .from(RESUMES_BUCKET)
      .upload(storagePath, fileEntry);

    if (error || !data?.url) {
      console.error("[actions/profile] upload error:", error);
      return { success: false, error: "Failed to upload resume." };
    }

    return { success: true, url: data.url, key: storagePath };
  } catch (error) {
    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to upload resume." };
  }
}
