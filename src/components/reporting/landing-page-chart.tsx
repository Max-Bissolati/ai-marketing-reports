"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2 } from "lucide-react";
import type { LandingPageData } from "@/types/reporting-types";

const SOURCE_COLORS: Record<string, string> = {
  email: "var(--primary)",
  linkedin: "#0a66c2",
  facebook: "#1877f2",
  instagram: "#e4405f",
  main_website: "#22d3ee",
  table_talker: "#a78bfa",
  poster: "#a78bfa",
  flyer: "#a78bfa",
  press_release: "#f59e0b",
  blog: "#34d399",
};

const SOURCE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  email: "Email",
  main_website: "Website",
  table_talker: "QR Code",
  press_release: "Press",
  blog: "Blog",
  facebook: "Facebook",
  instagram: "Instagram",
  poster: "Poster",
  flyer: "Flyer",
};

const chartConfig = {
  count: { label: "Tracking Links" },
} satisfies ChartConfig;

interface LandingPageChartProps {
  campaign: string;
}

interface ApiResponse {
  campaign: string;
  totalLinks: number;
  landingPages: LandingPageData[];
}

export function LandingPageChart({ campaign }: LandingPageChartProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/landing-pages?campaign=${encodeURIComponent(campaign)}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [campaign]);

  if (loading) {
    return (
      <Card className="bento-card border-0 shadow-none h-full">
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.landingPages.length === 0) return null;

  // Build chart data: one bar per source across all pages
  const allSources = new Map<string, number>();
  for (const page of data.landingPages) {
    for (const src of page.sources) {
      const key = src.source;
      allSources.set(key, (allSources.get(key) || 0) + src.count);
    }
  }

  const chartData = Array.from(allSources.entries())
    .map(([source, count]) => ({
      channel: SOURCE_LABELS[source] || source,
      rawSource: source,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="bento-card border-0 shadow-none h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Campaign Landing Pages</CardTitle>
            <CardDescription>
              Destination pages & tracking link distribution from Sink
            </CardDescription>
          </div>
          <Badge className="bg-white/5 text-muted-foreground border border-white/10">
            {data.totalLinks} Links
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Landing page cards */}
        <div className="space-y-3 mb-6">
          {data.landingPages.map((page) => (
            <div
              key={page.url}
              className="rounded-xl bg-white/[0.03] border border-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {page.label}
                  </h4>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block"
                  >
                    {page.url.replace(/^https?:\/\/(www\.)?/, "")}
                    <ExternalLink className="inline w-3 h-3 ml-1 -mt-0.5" />
                  </a>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 bg-primary/10 text-primary border-primary/20"
                >
                  {page.totalLinks} links
                </Badge>
              </div>

              {/* Source badges */}
              <div className="flex flex-wrap gap-2">
                {page.sources.map((src) => (
                  <div
                    key={`${src.source}-${src.medium}`}
                    className="flex items-center gap-1.5"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          SOURCE_COLORS[src.source] || "var(--muted-foreground)",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {SOURCE_LABELS[src.source] || src.source}{" "}
                      <span className="text-foreground font-medium">
                        {src.count}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Channel distribution chart */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
            Link Distribution by Channel
          </p>
          <ChartContainer
            config={chartConfig}
            className="max-h-[200px] w-full [&_svg]:overflow-visible"
          >
            <BarChart data={chartData} margin={{ left: 0, right: 0, top: 10 }}>
              <CartesianGrid vertical={false} opacity={0.3} />
              <XAxis
                dataKey="channel"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={11}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "rgba(255,102,0,0.05)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.channel}
                    fill={
                      SOURCE_COLORS[entry.rawSource] || "var(--primary)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
