import { createPostHogServer } from "@/lib/posthog-server";
import type { AnalyticsEvent } from "@/agent/types";

export async function fireEvents(userId: string, events: AnalyticsEvent[]) {
  const posthog = createPostHogServer();
  for (const e of events) {
    posthog.capture({ distinctId: userId, ...e });
  }
  await posthog.shutdown();
}
