import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined" && !posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      capture_pageview: false, // manual pageview tracking via PostHogPageView

      // Disable features not used by JobPilot.
      // These all call /decide or remote config endpoints which return 401
      // when feature flags are not set up on the project.
      advanced_disable_decide: true,       // stops feature flags + surveys + toolbar
      disable_session_recording: true,     // no session replay needed
      autocapture: false,                  // we track only explicit events
    });
  }
}

// Initialize eagerly at module level so posthog is ready before any
// React effect runs. The typeof window guard makes this SSR-safe.
if (typeof window !== "undefined") {
  initPostHog();
}

export { posthog };

