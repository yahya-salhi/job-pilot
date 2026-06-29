import { PosthogAnalyticsService } from "./posthog-service";
import type { IAnalyticsService } from "@/types/analytics-service";

let _instance: IAnalyticsService | null = null;

export function createAnalyticsService(): IAnalyticsService {
  if (!_instance) {
    _instance = new PosthogAnalyticsService();
  }
  return _instance;
}

export const analytics: IAnalyticsService = createAnalyticsService();
