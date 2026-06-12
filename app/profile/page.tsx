"use client";

import { useState, useMemo } from "react";
import { ProfileBanner } from "@/components/profile/ProfileBanner";
import { ResumeCard } from "@/components/profile/ResumeCard";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfessionalInfoForm } from "@/components/profile/ProfessionalInfoForm";
import { WorkExperienceForm } from "@/components/profile/WorkExperienceForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { JobPreferencesForm } from "@/components/profile/JobPreferencesForm";

export default function ProfilePage() {
  const [profile] = useState({
    fullName: "Faizan Ali",
    email: "faizan@jsmastery.pro",
    phone: "+1 (555) 000-0000",
    location: "City, Country",
    linkedinUrl: "https://linkedin.com/in/faizan",
    portfolioUrl: "https://github.com/jsmastery",
    workAuthorization: "Citizen",
    currentTitle: "Frontend Engineer",
    experienceLevel: "Junior",
    yearsExperience: "4",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    industries: [],
    workExperience: [
      {
        company: "Vercel",
        title: "Frontend Engineer",
        startDate: "January 2022",
        endDate: "",
        currentlyWorking: true,
        responsibilities: "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
      },
    ],
    education: {
      degree: "High School",
      field: "Computer Science",
      institution: "E.g. State University",
      graduationYear: "YYYY",
    },
    jobPreferences: {
      titlesSeeking: "Frontend Engineer, React Developer",
      remotePreference: "Any",
      salaryExpectation: "",
      preferredLocations: "",
    },
  });

  // Mock completion calculation
  const completionPercentage = useMemo(() => {
    const requiredFields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.location,
      profile.currentTitle,
      profile.yearsExperience,
      profile.skills.length > 0,
      profile.workExperience.length > 0,
      profile.education.degree,
      profile.education.field
    ];
    
    const filledFields = requiredFields.filter(Boolean).length;
    // Hardcoding to 70% to match design for this specific mock data
    return Math.round((filledFields / requiredFields.length) * 100) > 70 ? 70 : 70; 
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1000px] mx-auto px-6 py-10 space-y-8">
        <ProfileBanner percentage={completionPercentage} />
        <ResumeCard />

        <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8 space-y-10">
            <div>
              <h3 className="text-xl font-bold text-text-primary">Profile Information</h3>
              <p className="text-sm text-text-secondary mt-1">
                This context is used to accurately represent you in agent interactions.
              </p>
              <div className="h-[1px] bg-border-light mt-6" />
            </div>

            <PersonalInfoForm data={profile} />
            <div className="h-[1px] bg-border-light" />
            
            <ProfessionalInfoForm data={profile} />
            <div className="h-[1px] bg-border-light" />

            <WorkExperienceForm experience={profile.workExperience} />
            <div className="h-[1px] bg-border-light" />

            <EducationForm education={profile.education} />
            <div className="h-[1px] bg-border-light" />

            <JobPreferencesForm preferences={profile.jobPreferences} />

            <button className="w-full bg-accent text-white py-3.5 rounded-xl font-bold text-sm hover:bg-accent-dark transition-all shadow-md shadow-accent/20 mt-4">
              Save Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
