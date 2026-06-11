import type { Metadata } from "next";
import { Inter } from "next/font/google";       
import "./globals.css";
import { PHProvider } from "./providers";       
import PostHogPageView from "./PostHogPageView";
import PostHogAuthHandler from "./PostHogAuthHandler";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPilot - AI-Powered Job Hunting Assistant",
  description: "Find jobs, get match scores, research companies, and polish your resume with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <PHProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
            <PostHogAuthHandler />
          </Suspense>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
