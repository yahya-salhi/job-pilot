function safeHogQLString(value: string): string {
  return value.replace(/'/g, "\\'");
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type QueryResult<T> = { data: T[] | null; error: string | null };

function getClient() {
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!apiKey) {
    throw new Error("POSTHOG_PERSONAL_API_KEY is not configured");
  }
  if (!projectId) {
    throw new Error("POSTHOG_PROJECT_ID is not configured");
  }

  return { apiKey, projectId, host };
}

function assertUserId(userId: string): void {
  if (!UUID_RE.test(userId)) {
    throw new Error(`Invalid userId format: ${userId}`);
  }
}

async function runHogQL(query: string): Promise<QueryResult<Record<string, unknown>>> {
  try {
    const { apiKey, projectId, host } = getClient();

    const response = await fetch(
      `${host}/api/projects/${projectId}/query/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: { kind: "HogQLQuery", query },
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return { data: null, error: `PostHog query failed (${response.status}): ${text}` };
    }

    const result = await response.json();
    const columns: string[] = result.columns ?? [];
    const rows: unknown[][] = result.results ?? [];
    const data = rows.map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown PostHog query error",
    };
  }
}

export type DayCount = { day: string; count: number };

export async function getJobsFoundOverTime(
  userId: string,
  days = 30,
): Promise<QueryResult<DayCount>> {
  assertUserId(userId);
  const result = await runHogQL(`
    SELECT toStartOfDay(timestamp) AS day, count() AS count
    FROM events
    WHERE event = 'job_found'
      AND distinct_id = '${safeHogQLString(userId)}'
      AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY day
    ORDER BY day ASC
  `);

  if (result.error) return { data: null, error: result.error };
  const data = (result.data ?? []).map((r) => ({
    day: String(r.day ?? ""),
    count: Number(r.count ?? 0),
  }));
  return { data, error: null };
}

export type MatchScoreRange = { range: string; count: number };

export async function getMatchScoreDistribution(
  userId: string,
): Promise<QueryResult<MatchScoreRange>> {
  assertUserId(userId);
  const result = await runHogQL(`
    SELECT
      multiIf(
        properties.matchScore < 60, '50-60%',
        properties.matchScore < 70, '60-70%',
        properties.matchScore < 80, '70-80%',
        properties.matchScore < 90, '80-90%',
        '90-100%'
      ) AS range,
      count() AS count
    FROM events
    WHERE event = 'job_found'
      AND distinct_id = '${safeHogQLString(userId)}'
    GROUP BY range
    ORDER BY range ASC
  `);

  if (result.error) return { data: null, error: result.error };
  const data = (result.data ?? []).map((r) => ({
    range: String(r.range ?? ""),
    count: Number(r.count ?? 0),
  }));
  return { data, error: null };
}

export async function getCompanyResearchActivity(
  userId: string,
  days = 7,
): Promise<QueryResult<DayCount>> {
  assertUserId(userId);
  const result = await runHogQL(`
    SELECT toStartOfDay(timestamp) AS day, count() AS count
    FROM events
    WHERE event = 'company_researched'
      AND distinct_id = '${safeHogQLString(userId)}'
      AND timestamp >= now() - INTERVAL ${days} DAY
    GROUP BY day
    ORDER BY day ASC
  `);

  if (result.error) return { data: null, error: result.error };
  const data = (result.data ?? []).map((r) => ({
    day: String(r.day ?? ""),
    count: Number(r.count ?? 0),
  }));
  return { data, error: null };
}
