"use client";

import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayCount, MatchScoreRange } from "@/types/analytics-service";

function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isNarrow;
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-12 h-70">
      <p className="text-sm text-gray-400 text-center max-w-xs">{message}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] p-4 lg:p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] h-full flex flex-col">
      <h2 className="text-sm lg:text-base font-semibold text-text-primary mb-6">{title}</h2>
      <div className="flex-1 min-h-70">{children}</div>
    </div>
  );
}

function formatDay(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-70">
      {width > 0 && (
        <ResponsiveContainer width={width} height={280} debounce={50}>
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}

const sharedGridStyle = "#F3F4F6";
const sharedTooltipStyle = {
  background: "#ffffff",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  fontSize: "13px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

export function JobsFoundChart({ data }: { data: DayCount[] }) {
  const isNarrow = useIsNarrow();
  const tickStyle = { fontSize: isNarrow ? 10 : 12, fill: "#9CA3AF" };
  if (!data || data.length === 0)
    return (
      <ChartCard title="Jobs Found Over Time">
        <EmptyChart message="No data yet" />
      </ChartCard>
    );

  return (
    <ChartCard title="Jobs Found Over Time">
      <ChartContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={sharedGridStyle}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            tick={tickStyle}
            axisLine={{ stroke: sharedGridStyle }}
            tickLine={false}
            dy={10}
          />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip
            contentStyle={sharedTooltipStyle}
            labelFormatter={(l) => formatDay(l)}
          />
          <Area
            type="natural"
            dataKey="count"
            stroke="#8B5CF6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorJobs)"
            activeDot={{
              r: 5,
              fill: "#8B5CF6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function CompanyResearchChart({ data }: { data: DayCount[] }) {
  const isNarrow = useIsNarrow();
  const tickStyle = { fontSize: isNarrow ? 10 : 12, fill: "#9CA3AF" };
  if (!data || data.length === 0)
    return (
      <ChartCard title="Company Research Activity">
        <EmptyChart message="No data yet" />
      </ChartCard>
    );

  return (
    <ChartCard title="Company Research Activity">
      <ChartContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
          barSize={36}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={sharedGridStyle}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            tick={tickStyle}
            axisLine={{ stroke: sharedGridStyle }}
            tickLine={false}
            dy={10}
          />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip
            contentStyle={sharedTooltipStyle}
            labelFormatter={(l) => formatDay(l)}
            cursor={{ fill: "#F9FAFB" }}
          />
          <Bar dataKey="count" fill="#4ea5ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

export function MatchScoreChart({ data }: { data: MatchScoreRange[] }) {
  const isNarrow = useIsNarrow();
  const tickStyle = { fontSize: isNarrow ? 10 : 12, fill: "#9CA3AF" };
  if (!data || data.length === 0)
    return (
      <ChartCard title="Match Score Distribution">
        <EmptyChart message="No data yet" />
      </ChartCard>
    );

  return (
    <ChartCard title="Match Score Distribution">
      <ChartContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
          barSize={36}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={sharedGridStyle}
            vertical={false}
          />
          <XAxis
            dataKey="range"
            tick={tickStyle}
            axisLine={{ stroke: sharedGridStyle }}
            tickLine={false}
            dy={10}
          />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip
            contentStyle={sharedTooltipStyle}
            cursor={{ fill: "#F9FAFB" }}
          />
          <Bar dataKey="count" fill="#1fc387" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
