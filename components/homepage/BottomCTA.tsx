import Link from "next/link";

export function BottomCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-20 px-6 md:px-8 border-b border-border-light">
      {/* Background Soft Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div 
          className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] aspect-square max-w-[800px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, var(--color-accent-light) 0%, var(--color-info-light) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-[40px] font-bold text-text-primary leading-tight tracking-tight max-w-2xl">
          Your next job search can feel a lot less overwhelming
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base text-text-secondary max-w-xl leading-relaxed">
          Set up your profile, upload your resume, and start finding matches in minutes.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto bg-text-primary text-white hover:bg-opacity-90 font-medium text-sm px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-200"
          >
            Get Started
            <svg 
              className="w-2.5 h-2.5 fill-current" 
              viewBox="0 0 10 10" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 1 L8 5 L2 9 Z" />
            </svg>
          </Link>
          <Link
            href="/find-jobs"
            className="w-full sm:w-auto bg-surface text-text-primary border border-border-muted hover:bg-surface-secondary font-medium text-sm px-6 py-3 rounded-md transition-all duration-200 text-center"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
