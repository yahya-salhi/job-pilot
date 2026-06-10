import Image from "next/image";

export function Testimonial() {
  return (
    <section className="w-full bg-surface py-20 px-6 md:px-8 border-t border-b border-border-light">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Uppercase Accent Subtitle */}
        <span className="text-accent font-semibold text-xs tracking-wider uppercase">
          Success Stories
        </span>

        {/* Big Quote */}
        <blockquote className="mt-6 text-xl md:text-2xl lg:text-[26px] font-semibold text-text-primary leading-relaxed max-w-3xl">
          “I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see interviews waiting. It feels like cheating. Had 3 offers on the table simultaneously.”
        </blockquote>

        {/* User Profile info */}
        <div className="mt-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
            <Image
              src="/images/user-icon.png"
              alt="Tom Wilson"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <cite className="mt-3 not-italic font-semibold text-text-primary text-sm">
            Tom Wilson
          </cite>
          <span className="text-text-secondary text-xs mt-0.5">
            Junior Developer
          </span>
        </div>
      </div>
    </section>
  );
}
