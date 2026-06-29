import type { InsforgeClient } from "@/agent/types";
import type { ProfileDbInsert } from "@/mappers/profile-mapper";

export type ProfileRow = {
  current_title: string;
  years_experience: number | null;
  experience_level: string;
  skills: string[];
  work_experience: unknown;
};

export async function getProfileForResearch(
  insforge: InsforgeClient,
  userId: string,
): Promise<ProfileRow> {
  const { data: profile, error: profileError } = await insforge.database
    .from("profiles")
    .select("current_title, years_experience, experience_level, skills, work_experience")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found.");
  }

  return {
    current_title: profile.current_title || "",
    years_experience: profile.years_experience,
    experience_level: profile.experience_level || "mid",
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    work_experience: profile.work_experience,
  };
}

export async function getProfileSkills(
  insforge: InsforgeClient,
  userId: string,
): Promise<{ skills: string[]; summary: string }> {
  const { data, error } = await insforge.database
    .from("profiles")
    .select("skills, current_title, years_experience, work_experience")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return { skills: [], summary: "" };
  }

  const skills: string[] = Array.isArray(data.skills) ? data.skills : [];
  const summary = [data.current_title, data.years_experience ? `${data.years_experience} years` : ""]
    .filter(Boolean)
    .join(" — ");

  return { skills, summary };
}

export async function upsertProfile(
  insforge: InsforgeClient,
  record: ProfileDbInsert,
): Promise<void> {
  const { error } = await insforge.database
    .from("profiles")
    .upsert([record], { ignoreDuplicates: false })
    .select()
    .single();

  if (error) {
    console.error("[data/profiles] upsert error:", error);
    throw new Error("Failed to save profile.");
  }
}
