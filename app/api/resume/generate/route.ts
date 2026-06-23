import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  createOpenRouterClient,
  getResumeGenerateModel,
} from "@/lib/openrouter";
import {
  renderResumePdf,
  type ResumeContent,
  type ContactInfo,
} from "@/lib/resume-pdf";

export const runtime = "nodejs";

export async function POST() {
  try {
    const insforge = await createInsforgeServer();

    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to generate a resume." },
        { status: 401 },
      );
    }

    const userId = authData.user.id;

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: "Complete and save your profile before generating a resume.",
        },
        { status: 400 },
      );
    }

    let openrouter;
    try {
      openrouter = createOpenRouterClient();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI resume generation is not configured. Contact support.",
        },
        { status: 500 },
      );
    }

    const systemPrompt = `You are a professional resume writer. Given a candidate's profile data, generate polished, professional resume content.

Return ONLY valid JSON matching this exact shape:
{
  "summary": "2-3 sentence professional summary paragraph",
  "experience": [
    {
      "company": "string",
      "title": "string",
      "dateRange": "string (e.g. 'Jan 2020 - Present')",
      "bullets": ["array of 2-4 polished bullet points describing achievements and responsibilities"]
    }
  ],
  "skills": ["array of skill strings — reformat and organize from the input"],
  "education": {
    "degree": "string",
    "field": "string",
    "institution": "string",
    "year": "string"
  }
}

Rules:
- Write a compelling professional summary that highlights the candidate's strengths and career trajectory.
- Polish work experience responsibilities into achievement-oriented bullet points. Use strong action verbs.
- Do not invent experience, skills, education, or facts that are not in the provided profile.
- If a section has no data, return its default value (empty array or empty strings).
- Keep the resume to a single page — be concise.
- Return ONLY valid JSON with no markdown.`;

    const userPrompt = `Generate a professional resume from this profile data:

Full Name: ${profile.full_name}
Current Title: ${profile.current_title}
Experience Level: ${profile.experience_level}
Years of Experience: ${profile.years_experience}
Skills: ${(profile.skills || []).join(", ")}
Industries: ${(profile.industries || []).join(", ")}

Work Experience:
${JSON.stringify(profile.work_experience || [], null, 2)}

Education:
${JSON.stringify(profile.education || {}, null, 2)}

LinkedIn: ${profile.linkedin_url || "Not provided"}
Portfolio: ${profile.portfolio_url || "Not provided"}`;

    const completion = await openrouter.chat.completions.create({
      model: getResumeGenerateModel(),
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_completion_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "AI generation returned an empty response. Please try again.",
        },
        { status: 502 },
      );
    }

    let resumeContent: ResumeContent;
    try {
      resumeContent = JSON.parse(content) as ResumeContent;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI generation returned invalid data. Please try again.",
        },
        { status: 502 },
      );
    }

    const contact: ContactInfo = {
      email: profile.email || undefined,
      phone: profile.phone || undefined,
      location: profile.location || undefined,
    };

    const pdfBuffer = await renderResumePdf(
      resumeContent,
      profile.full_name || "Candidate",
      contact,
    );

    const storagePath = `${userId}/resume-generated.pdf`;
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(storagePath, pdfBlob);

    if (uploadError || !uploadData?.url) {
      console.error("[api/resume/generate] upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save generated resume. Please try again.",
        },
        { status: 500 },
      );
    }

    const resumePdfUrl = uploadData.url;

    if (resumePdfUrl) {
      const { error: updateError } = await insforge.database
        .from("profiles")
        .update({ resume_pdf_url: resumePdfUrl })
        .eq("id", userId);

      if (updateError) {
        console.error(
          "[api/resume/generate] profile update error:",
          updateError,
        );
      }
    }

    return NextResponse.json({ success: true, url: resumePdfUrl });
  } catch (error) {
    console.error("[api/resume/generate]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate resume. Please try again.",
      },
      { status: 500 },
    );
  }
}
