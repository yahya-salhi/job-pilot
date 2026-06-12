"use client";

export function ResumeCard() {
  return (
    <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-text-primary">Resume</h3>
        <p className="text-sm text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
        </p>
      </div>

      <div className="border-2 border-dashed border-border-muted rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-accent-muted flex items-center justify-center text-accent">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary">Click to upload or drag and drop</p>
          <p className="text-xs text-text-muted mt-1">PDF formatting only. Maximum file size 5MB.</p>
        </div>
        <button className="px-4 py-2 border border-border-muted rounded-md text-xs font-bold text-text-dark hover:bg-surface-secondary transition-colors">
          Select Resume
        </button>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-light">
        <p className="text-xs text-text-secondary">Need a fresh document based on the fields below?</p>
        <button className="bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-accent-dark transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
          Generate Resume from Profile
        </button>
      </div>
    </div>
  );
}
