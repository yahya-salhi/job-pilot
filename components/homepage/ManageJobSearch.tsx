import Image from "next/image";

export function ManageJobSearch() {
  return (
    <section className="w-full py-20 px-6 md:px-8 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column - Content */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-3xl md:text-[40px] font-bold text-text-primary leading-tight tracking-tight mb-8">
            Manage Your Job<br />Search With Ease
          </h2>
          
          <div className="flex flex-col">
            {/* Feature Item 1 - Active */}
            <div className="border-l-4 border-accent bg-accent-muted/30 pl-6 py-4">
              <h3 className="font-bold text-text-primary text-base md:text-lg">
                Find jobs that actually fit
              </h3>
              <p className="text-text-secondary text-sm md:text-base mt-2 leading-relaxed">
                Search by title and location or paste a job link. Get matched roles you can quickly scan.
              </p>
            </div>

            {/* Feature Item 2 - Inactive */}
            <div className="border-l-4 border-transparent pl-6 py-4 border-t border-border-light">
              <h3 className="font-bold text-text-primary text-base md:text-lg">
                Know the Company Before You Apply
              </h3>
              <p className="text-text-secondary text-sm md:text-base mt-2 leading-relaxed">
                Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.
              </p>
            </div>

            {/* Feature Item 3 - Inactive */}
            <div className="border-l-4 border-transparent pl-6 py-4 border-t border-border-light">
              <h3 className="font-bold text-text-primary text-base md:text-lg">
                Keep track of every application
              </h3>
              <p className="text-text-secondary text-sm md:text-base mt-2 leading-relaxed">
                Keep a clear view of every job you&apos;ve found, tailored. Your activity and progress all stay in one simple place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Mockup */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[560px] rounded-xl overflow-hidden shadow-lg border border-border bg-surface">
            <Image
              src="/images/jobs-lists.png"
              alt="Job Matches List Mockup"
              width={560}
              height={350}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
