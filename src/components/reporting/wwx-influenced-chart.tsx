"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

// Static data from HubSpot Campaign Dashboard (Aug 2025 – Apr 2026)
const DATA = [
  { month: "Sep '25", count: 468 },
  { month: "Oct '25", count: 752 },
  { month: "Nov '25", count: 730 },
  { month: "Dec '25", count: 543 },
  { month: "Jan '26", count: 700 },
  { month: "Feb '26", count: 665 },
  { month: "Mar '26", count: 660 },
  { month: "Apr '26", count: 52 },
];

const chartConfig = {
  count: { label: "Influenced Contacts", color: "#22d3ee" },
} satisfies ChartConfig;

export function WWXInfluencedChart() {
  return (
    <Card className="bento-card border-0 shadow-none h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Influenced Contacts</CardTitle>
            <CardDescription>Monthly unique marketing influences</CardDescription>
          </div>
          <Badge className="bg-white/5 text-muted-foreground border border-white/10 text-xs">
            HubSpot Attribution
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[280px] w-full mt-4 [&_svg]:overflow-visible"
        >
          <LineChart data={DATA} margin={{ left: 0, right: 10 }}>
            <CartesianGrid vertical={false} opacity={0.3} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="count"
              type="monotone"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ fill: "#22d3ee", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
