"use client";

import { useRef } from "react";

type Props = {
  resumeUrl: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onExtract: () => void;
  isExtracting: boolean;
  extractError: string;
  onGenerate: () => void;
  isGenerating: boolean;
  generateError: string;
};

export function ResumeCard({
  resumeUrl,
  selectedFile,
  onFileSelect,
  onExtract,
  isExtracting,
  extractError,
  onGenerate,
  isGenerating,
  generateError,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
    // Reset input so selecting the same file again triggers onChange
    e.target.value = "";
  };

  const displayName = selectedFile
    ? selectedFile.name
    : resumeUrl
    ? "resume.pdf"
    : null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Resume</h3>
        <p className="text-sm text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new
          tailored one from your details below.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="border-2 border-dashed border-border-muted rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:border-accent/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div>
          {displayName ? (
            <>
              <p className="text-sm font-bold text-accent">{displayName}</p>
              <p className="text-xs text-text-muted mt-1">
                {selectedFile
                  ? "Ready to upload — save profile to confirm"
                  : resumeUrl
                  ? "Currently saved"
                  : ""}
              </p>
              {resumeUrl && !selectedFile && (
                <a
                  href="/api/resume/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-accent hover:text-accent-dark transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Open PDF
                </a>
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-text-primary">Click to upload or drag and drop</p>
              <p className="text-xs text-text-muted mt-1">PDF formatting only. Maximum file size 5MB.</p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-4 py-2 border border-border rounded-md text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors"
        >
          {displayName ? "Replace Resume" : "Select Resume"}
        </button>
      </div>

      {resumeUrl && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border-light">
          <p className="text-xs text-text-secondary">
            Auto-fill profile fields from your saved resume.
          </p>
          <button
            type="button"
            onClick={onExtract}
            disabled={isExtracting}
            className="bg-accent text-white px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2 hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {isExtracting ? "Extracting..." : "Extract from Resume"}
          </button>
        </div>
      )}

      {extractError && (
        <p className="text-sm text-error font-medium">{extractError}</p>
      )}

      {generateError && (
        <p className="text-sm text-error font-medium">{generateError}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border-light">
        <p className="text-xs text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-accent text-white px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2 hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
          {isGenerating ? "Generating..." : "Generate Resume from Profile"}
        </button>
      </div>
    </div>
  );
}
