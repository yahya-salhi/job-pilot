"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { computeIsComplete } from "@/lib/profile-completion";
import { validateResumeFile } from "@/lib/resume-upload";
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

    const jobTitlesSeeking = formData.jobTitlesSeeking
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const preferredLocations = formData.preferredLocations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const profileRecord = {
      id: authData.user.id,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      current_title: formData.currentTitle,
      experience_level: formData.experienceLevel,
      years_experience: (() => {
        const parsed = parseInt(formData.yearsExperience, 10);
        return Number.isNaN(parsed) ? null : parsed;
      })(),
      skills: formData.skills,
      industries: formData.industries,
      work_experience: formData.workExperience,
      education: formData.education,
      job_titles_seeking: jobTitlesSeeking,
      remote_preference: formData.remotePreference,
      salary_expectation: formData.salaryExpectation,
      preferred_locations: preferredLocations,
      cover_letter_tone: formData.coverLetterTone,
      linkedin_url: formData.linkedinUrl,
      portfolio_url: formData.portfolioUrl,
      work_authorization: formData.workAuthorization,
      resume_pdf_url: formData.resumePdfUrl,
      is_complete: isComplete,
    };

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

    const storagePath = `${authData.user.id}/resume.pdf`;
    const { data, error } = await insforge.storage
      .from("resumes")
      .upload(storagePath, fileEntry);

    if (error || !data?.url) {
      console.error("[actions/profile] upload error:", error);
      return { success: false, error: "Failed to upload resume." };
    }

    return { success: true, url: data.url };
  } catch (error) {
    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to upload resume." };
  }
}
