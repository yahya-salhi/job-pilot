"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { ProfileBanner } from "@/components/profile/ProfileBanner";
import { ResumeCard } from "@/components/profile/ResumeCard";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfessionalInfoForm } from "@/components/profile/ProfessionalInfoForm";
import { WorkExperienceForm } from "@/components/profile/WorkExperienceForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { JobPreferencesForm } from "@/components/profile/JobPreferencesForm";
import { saveProfile, uploadResume } from "@/actions/profile";
import { getProfileCompletion } from "@/lib/profile-completion";
import type { ProfileFormData, ProfileOnChange } from "@/types";

type Props = {
  initialProfile: ProfileFormData;
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export function ProfileClient({ initialProfile }: Props) {
  const EMPTY_FORM: ProfileFormData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    workAuthorization: "citizen",
    currentTitle: "",
    experienceLevel: "junior",
    yearsExperience: "",
    skills: [],
    industries: [],
    workExperience: [],
    education: { degree: "", field: "", institution: "", graduationYear: "" },
    jobTitlesSeeking: "",
    remotePreference: "any",
    salaryExpectation: "",
    preferredLocations: "",
    coverLetterTone: "formal",
    resumePdfUrl: "",
  };

  const [form, setForm] = useState<ProfileFormData>(initialProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const onChange: ProfileOnChange = useCallback(<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const { percentage, missingFields, isComplete } = useMemo(
    () => getProfileCompletion(form),
    [form],
  );

  const handleSave = () => {
    setSaveStatus("saving");
    setErrorMessage("");

    startTransition(async () => {
      let currentForm = form;
      const currentFile = selectedFile;

      if (currentFile) {
        const fd = new FormData();
        fd.append("file", currentFile);
        const uploadResult = await uploadResume(fd);
        if (!uploadResult.success) {
          setSaveStatus("error");
          setErrorMessage(uploadResult.error ?? "Failed to upload resume");
          return;
        }
        if (uploadResult.url) {
          currentForm = { ...currentForm, resumePdfUrl: uploadResult.url };
          setForm(currentForm);
        }
        setSelectedFile(null);
      }

      const result = await saveProfile(currentForm);
      if (result.success) {
        setForm(EMPTY_FORM);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setErrorMessage(result.error ?? "Failed to save profile");
      }
    });
  };

  const saveButtonLabel =
    isPending || saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "success"
      ? "✓ Saved!"
      : "Save Profile";

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-250 mx-auto px-6 py-10 space-y-8">
        <ProfileBanner
          percentage={percentage}
          missingFields={missingFields}
          isComplete={isComplete}
        />

        <ResumeCard
          resumeUrl={form.resumePdfUrl}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />

        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-10">
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Profile Information
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                This context is used to accurately represent you in agent
                interactions.
              </p>
              <div className="h-px bg-border-light mt-6" />
            </div>

            <PersonalInfoForm form={form} onChange={onChange} />
            <div className="h-px bg-border-light" />

            <ProfessionalInfoForm form={form} onChange={onChange} />
            <div className="h-px bg-border-light" />

            <WorkExperienceForm form={form} onChange={onChange} />
            <div className="h-px bg-border-light" />

            <EducationForm form={form} onChange={onChange} />
            <div className="h-px bg-border-light" />

            <JobPreferencesForm form={form} onChange={onChange} />

            {saveStatus === "error" && (
              <p className="text-sm text-error font-medium">{errorMessage}</p>
            )}

            <button
              type="button"
              id="save-profile-btn"
              onClick={handleSave}
              disabled={isPending || saveStatus === "saving"}
              className="w-full bg-accent text-white py-2 px-4 rounded-md font-medium text-sm hover:bg-accent-dark transition-colors mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveButtonLabel}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
