import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { ManageJobSearch } from "@/components/homepage/ManageJobSearch";
import { ApplyConfidence } from "@/components/homepage/ApplyConfidence";
import { Testimonial } from "@/components/homepage/Testimonial";
import { BottomCTA } from "@/components/homepage/BottomCTA";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Contents */}
      <main className="grow flex flex-col">
        {/* 1. Hero Section (Includes Dashboard Mockup) */}
        <Hero />

        {/* Diagonal Striped Divider */}
        <div className="w-full h-16 bg-stripes border-t border-b border-border-light" />

        {/* 2. Manage Job Search section */}
        <ManageJobSearch />

        {/* Diagonal Striped Divider */}
        <div className="w-full h-16 bg-stripes border-t border-b border-border-light" />

        {/* 3. Apply with Confidence section */}
        <ApplyConfidence />

        {/* Diagonal Striped Divider */}
        <div className="w-full h-16 bg-stripes border-t border-b border-border-light" />

        {/* 4. Testimonial section */}
        <Testimonial />

        {/* Diagonal Striped Divider */}
        <div className="w-full h-16 bg-stripes border-t border-b border-border-light" />

        {/* 5. Bottom CTA section */}
        <BottomCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;
