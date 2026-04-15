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
import { Badge } from "@/components/ui/badge";

const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  marketingqualifiedlead: "MQL",
  salesqualifiedlead: "SQL",
  opportunity: "Opportunity",
  customer: "Customer",
  other: "Other",
  "(no value)": "No Value",
};

const STAGE_COLORS: Record<string, string> = {
  lead: "var(--primary)",
  marketingqualifiedlead: "var(--chart-5)",
  salesqualifiedlead: "#a78bfa",
  opportunity: "#34d399",
  customer: "#22d3ee",
  other: "var(--muted-foreground)",
  "(no value)": "var(--muted-foreground)",
};

const chartConfig = {
  count: { label: "Contacts" },
} satisfies ChartConfig;

interface LifecycleChartProps {
  data: { stage: string; count: number }[];
}

export function LifecycleChart({ data }: LifecycleChartProps) {
  const chartData = data.map((d) => ({
    stage: STAGE_LABELS[d.stage] || d.stage,
    rawStage: d.stage,
    count: d.count,
  }));

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="bento-card border-0 shadow-none h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lifecycle Stages</CardTitle>
            <CardDescription>Contact progression from HubSpot</CardDescription>
          </div>
          <Badge className="bg-white/5 text-muted-foreground border border-white/10">
            {total} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[280px] w-full mt-4"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 0 }}
          >
            <CartesianGrid horizontal={false} opacity={0.3} />
            <YAxis
              dataKey="stage"
              type="category"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: "var(--muted-foreground)" }}
              width={50}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={{ fill: "rgba(255,102,0,0.05)" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.stage}
                  fill={STAGE_COLORS[entry.rawStage] || "var(--primary)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
