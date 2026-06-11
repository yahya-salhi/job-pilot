import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-16 pb-20 px-6 md:px-8">
      {/* Background Soft Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div 
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] aspect-square max-w-[1000px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, var(--color-accent-light) 0%, var(--color-info-light) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-text-primary leading-tight max-w-4xl">
          Job hunting is hard.<br />
          Your tools shouldn&apos;t be.
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed">
          Stop applying blind. JobPilot finds the jobs, researches the companies, and gives you everything you need to stand out.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
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

        {/* Dashboard Preview */}
        <div className="mt-16 w-full max-w-[940px] rounded-xl overflow-hidden shadow-2xl border border-border bg-surface">
          <Image
            src="/images/dashboard-demo.png"
            alt="JobPilot Dashboard Preview"
            width={940}
            height={530}
            priority
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}
