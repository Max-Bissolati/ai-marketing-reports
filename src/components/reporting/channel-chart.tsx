"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const SOURCE_COLORS: Record<string, string> = {
  linkedin: "#0a66c2",
  email: "var(--primary)",
  main_website: "#22d3ee",
  table_talker: "#a78bfa",
  press_release: "#f59e0b",
  unknown: "var(--muted-foreground)",
};

const SOURCE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  email: "Email",
  main_website: "Website",
  table_talker: "QR Code",
  press_release: "Press",
  google: "Google",
  facebook: "Facebook",
};

const chartConfig = {
  count: { label: "Contacts" },
} satisfies ChartConfig;

interface ChannelChartProps {
  data: { source: string; medium: string; count: number }[];
}

export function ChannelChart({ data }: ChannelChartProps) {
  const chartData = data.map((d) => ({
    channel: SOURCE_LABELS[d.source] || d.source,
    medium: d.medium,
    rawSource: d.source,
    count: d.count,
  }));

  return (
    <Card className="bento-card border-0 shadow-none h-full">
      <CardHeader className="pb-2">
        <CardTitle>Attribution Channels</CardTitle>
        <CardDescription>
          Where contacts came from (source / medium)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[280px] w-full mt-4"
        >
          <BarChart data={chartData} margin={{ left: 0, right: 0, top: 10 }}>
            <CartesianGrid vertical={false} opacity={0.3} />
            <XAxis
              dataKey="channel"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={{ fill: "rgba(255,102,0,0.05)" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const item = payload?.[0]?.payload;
                    return item
                      ? `${item.channel} / ${item.medium}`
                      : "";
                  }}
                />
              }
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
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

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
          {chartData.map((d) => (
            <div key={d.channel} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    SOURCE_COLORS[d.rawSource] || "var(--primary)",
                }}
              />
              <span className="text-xs text-muted-foreground">
                {d.channel}{" "}
                <span className="text-foreground font-medium">{d.count}</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
