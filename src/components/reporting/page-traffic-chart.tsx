"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const chartConfig = {
  views: {
    label: "Page Views",
    color: "var(--primary)",
  },
  sessions: {
    label: "Unique Sessions",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface PageTrafficData {
  pathname: string;
  totalViews: number;
  totalSessions: number;
  dataPoints: { date: string; views: number; sessions: number }[];
}

interface PageTrafficChartProps {
  pathname: string;
  title?: string;
  description?: string;
}

export function PageTrafficChart({
  pathname,
  title = "Landing Page Traffic",
  description = "Daily page views and unique sessions from Rybbit analytics",
}: PageTrafficChartProps) {
  const [data, setData] = useState<PageTrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    const days = timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90";
    setLoading(true);
    fetch(
      `/api/page-traffic?pathname=${encodeURIComponent(pathname)}&days=${days}`
    )
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname, timeRange]);

  if (loading) {
    return (
      <Card className="bento-card border-0 shadow-none">
        <CardContent className="flex items-center justify-center h-[350px]">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.dataPoints.length === 0) return null;

  return (
    <Card className="bento-card border-0 shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-6 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <div className="flex items-center gap-3">
            <CardTitle>{title}</CardTitle>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
              {data.totalViews.toLocaleString()} views
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex rounded-xl overflow-hidden bg-white/[0.04] backdrop-blur-[12px] backdrop-saturate-[1.2] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {(["90d", "30d", "7d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`relative px-4 py-1.5 text-sm transition-all overflow-hidden ${
                timeRange === range
                  ? "font-medium text-white bg-white/10"
                  : "bg-transparent text-muted-foreground hover:bg-white/5"
              }`}
            >
              {timeRange === range && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
              )}
              <span className="relative">
                {range === "90d"
                  ? "Last 3 months"
                  : range === "30d"
                    ? "Last 30 days"
                    : "Last 7 days"}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex gap-6 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Views</span>{" "}
            <span className="font-bold text-foreground">
              {data.totalViews.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Unique Sessions</span>{" "}
            <span className="font-bold text-foreground">
              {data.totalSessions.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Views/Session</span>{" "}
            <span className="font-bold text-foreground">
              {(data.totalViews / data.totalSessions).toFixed(1)}
            </span>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full [&_svg]:overflow-visible"
        >
          <AreaChart
            data={data.dataPoints}
            margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sessions"
              type="natural"
              fill="url(#fillSessions)"
              stroke="var(--color-sessions)"
              strokeWidth={2}
            />
            <Area
              dataKey="views"
              type="natural"
              fill="url(#fillViews)"
              stroke="var(--color-views)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
