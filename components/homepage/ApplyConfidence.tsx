import Image from "next/image";

export function ApplyConfidence() {
  return (
    <section className="w-full py-20 px-6 md:px-8 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column - Visual Mockup (Agent Log) */}
        <div className="lg:col-span-6 flex justify-center lg:order-1 order-2">
          <div className="w-full max-w-[500px] rounded-xl overflow-hidden shadow-lg border border-border bg-surface">
            <Image
              src="/images/agnet-log.png"
              alt="AI Agent Logs Terminal Mockup"
              width={500}
              height={320}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-6 flex flex-col justify-center lg:order-2 order-1">
          <h2 className="text-3xl md:text-[40px] font-bold text-text-primary leading-tight tracking-tight mb-8">
            Apply With More<br />Confidence, Every Time
          </h2>
          
          <div className="flex flex-col">
            {/* Feature Item 1 */}
            <div className="py-5">
              <h3 className="font-bold text-text-primary text-base md:text-lg">
                Understand your match score
              </h3>
              <p className="text-text-secondary text-sm md:text-base mt-2 leading-relaxed">
                See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.
              </p>
            </div>

            {/* Feature Item 2 */}
            <div className="py-5 border-t border-border-light">
              <h3 className="font-bold text-text-primary text-base md:text-lg">
                AI-Powered Job Matching
              </h3>
              <p className="text-text-secondary text-sm md:text-base mt-2 leading-relaxed">
                Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.
              </p>
            </div>

            {/* Feature Item 3 */}
            <div className="py-5 border-t border-border-light">
              <h3 className="font-bold text-text-primary text-base md:text-lg">
                Focus on the right roles
              </h3>
              <p className="text-text-secondary text-sm md:text-base mt-2 leading-relaxed">
                Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
