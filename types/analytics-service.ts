export type AnalyticsEventPayload = Record<string, unknown>;

export type DayCount = { day: string; count: number };
export type MatchScoreRange = { range: string; count: number };
export type QueryResult<T> = { data: T[] | null; error: string | null };

export interface IAnalyticsService {
  capture(
    userId: string,
    event: string,
    properties?: AnalyticsEventPayload,
  ): Promise<void>;

  getJobsFoundOverTime(
    userId: string,
    days?: number,
  ): Promise<QueryResult<DayCount>>;

  getMatchScoreDistribution(
    userId: string,
  ): Promise<QueryResult<MatchScoreRange>>;

  getCompanyResearchActivity(
    userId: string,
    days?: number,
  ): Promise<QueryResult<DayCount>>;
}
