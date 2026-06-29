import type { IAnalyticsService, AnalyticsEventPayload, QueryResult, DayCount, MatchScoreRange } from "@/types/analytics-service";

export class NoopAnalyticsService implements IAnalyticsService {
  async capture(
    _userId: string,
    _event: string,
    _properties?: AnalyticsEventPayload,
  ): Promise<void> {}

  async getJobsFoundOverTime(
    _userId: string,
    _days?: number,
  ): Promise<QueryResult<DayCount>> {
    return { data: null, error: null };
  }

  async getMatchScoreDistribution(
    _userId: string,
  ): Promise<QueryResult<MatchScoreRange>> {
    return { data: null, error: null };
  }

  async getCompanyResearchActivity(
    _userId: string,
    _days?: number,
  ): Promise<QueryResult<DayCount>> {
    return { data: null, error: null };
  }
}
