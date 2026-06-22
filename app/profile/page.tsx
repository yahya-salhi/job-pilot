import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileClient } from "@/components/profile/ProfileClient";
import type { ProfileFormData } from "@/types";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();

  const { data: authData, error: authError } =
    await insforge.auth.getCurrentUser();

  if (authError || !authData?.user) {
    redirect("/login");
  }

  const user = authData.user;

  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Map DB snake_case → camelCase for the form. Fall back to safe defaults.
  const initialProfile: ProfileFormData = {
    fullName: profile?.full_name ?? "",
    email: profile?.email ?? (user as { email?: string }).email ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    linkedinUrl: profile?.linkedin_url ?? "",
    portfolioUrl: profile?.portfolio_url ?? "",
    workAuthorization: profile?.work_authorization ?? "citizen",
    currentTitle: profile?.current_title ?? "",
    experienceLevel: profile?.experience_level ?? "junior",
    yearsExperience: profile?.years_experience?.toString() ?? "",
    skills: profile?.skills ?? [],
    industries: profile?.industries ?? [],
    workExperience: profile?.work_experience ?? [],
    education: profile?.education ?? {
      degree: "",
      field: "",
      institution: "",
      graduationYear: "",
    },
    jobTitlesSeeking: (profile?.job_titles_seeking ?? []).join(", "),
    remotePreference: profile?.remote_preference ?? "any",
    salaryExpectation: profile?.salary_expectation ?? "",
    preferredLocations: (profile?.preferred_locations ?? []).join(", "),
    coverLetterTone: profile?.cover_letter_tone ?? "formal",
    resumePdfUrl: profile?.resume_pdf_url ?? "",
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="grow">
        <ProfileClient initialProfile={initialProfile} />
      </main>
      <Footer />
    </div>
  );
}
