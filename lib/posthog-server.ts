import { PostHog } from "posthog-node";

export const createPostHogServer = () => {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    throw new Error("Missing NEXT_PUBLIC_POSTHOG_KEY");
  }
  
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    flushAt: 1, // send immediately
    flushInterval: 0, // no batching â€” Next.js functions are short-lived
  });
};
