"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayCount, MatchScoreRange } from "@/lib/posthog-query";

type Props = {
  jobsFoundData: DayCount[];
  matchScoreData: MatchScoreRange[];
  companyResearchData: DayCount[];
};

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-sm text-text-muted text-center max-w-xs">{message}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-text-primary mb-4">{title}</h2>
      {children}
    </div>
  );
}

function formatDay(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      if (!mounted.current) return;
      const w = el.getBoundingClientRect().width;
      if (w > 0) setWidth(w);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      mounted.current = false;
      ro.disconnect();
    };
  }, []);

  if (width === 0) {
    return (
      <div ref={containerRef} className="w-full" style={{ height: 220 }}>
        <div className="flex items-center justify-center h-full">
          <div className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full" style={{ height: 220 }}>
      <ResponsiveContainer width={width} height={220} debounce={50}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const sharedTickStyle = { fontSize: 11, fill: "#99a1af" };
const sharedAxisLineStyle = { stroke: "#e7eaf3" };
const sharedGridStyle = "#e5e7eb";
const sharedTooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e7eaf3",
  borderRadius: "8px",
  fontSize: "13px",
};

export function AnalyticsCharts({ jobsFoundData, matchScoreData, companyResearchData }: Props) {
  const renderJobsFound = jobsFoundData.length > 0;
  const renderCompanyResearch = companyResearchData.length > 0;
  const renderMatchScore = matchScoreData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Jobs Found Over Time">
        {renderJobsFound ? (
          <ChartContainer>
            <LineChart data={jobsFoundData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={sharedGridStyle} />
              <XAxis dataKey="day" tickFormatter={formatDay} tick={sharedTickStyle} axisLine={sharedAxisLineStyle} tickLine={false} />
              <YAxis allowDecimals={false} tick={sharedTickStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={sharedTooltipStyle} labelFormatter={(l) => formatDay(l)} />
              <Line type="monotone" dataKey="count" stroke="#7c5cfc" strokeWidth={2} dot={{ fill: "#7c5cfc", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        ) : (
          <EmptyChart message="No job discovery data yet. Start searching for jobs to see trends here." />
        )}
      </ChartCard>

      <ChartCard title="Company Research Activity">
        {renderCompanyResearch ? (
          <ChartContainer>
            <BarChart data={companyResearchData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={sharedGridStyle} />
              <XAxis dataKey="day" tickFormatter={formatDay} tick={sharedTickStyle} axisLine={sharedAxisLineStyle} tickLine={false} />
              <YAxis allowDecimals={false} tick={sharedTickStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={sharedTooltipStyle} labelFormatter={(l) => formatDay(l)} />
              <Bar dataKey="count" fill="#61a8ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyChart message="No company research data yet. Research companies from job details to see activity here." />
        )}
      </ChartCard>

      <ChartCard title="Match Score Distribution">
        {renderMatchScore ? (
          <ChartContainer>
            <BarChart data={matchScoreData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={sharedGridStyle} />
              <XAxis dataKey="range" tick={sharedTickStyle} axisLine={sharedAxisLineStyle} tickLine={false} />
              <YAxis allowDecimals={false} tick={sharedTickStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={sharedTooltipStyle} />
              <Bar dataKey="count" fill="#00bc7d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyChart message="No match score data yet. Jobs need to be scored before distribution can be shown." />
        )}
      </ChartCard>
    </div>
  );
}
