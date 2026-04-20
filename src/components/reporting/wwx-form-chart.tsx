"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  count: { label: "Submissions", color: "var(--primary)" },
} satisfies ChartConfig;

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[parseInt(m) - 1]} '${year.slice(2)}`;
}

interface Props {
  data: Array<{ month: string; count: number }>;
  total: number;
}

export function WWXFormChart({ data, total }: Props) {
  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.month) }));

  return (
    <Card className="bento-card border-0 shadow-none h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Form Submissions</CardTitle>
            <CardDescription>Monthly report download submissions</CardDescription>
          </div>
          <Badge className="bg-primary/20 text-primary border border-primary/30">
            {total.toLocaleString()} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[280px] w-full mt-4 [&_svg]:overflow-visible"
        >
          <AreaChart data={chartData} margin={{ left: 0, right: 10 }}>
            <defs>
              <linearGradient id="subsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} opacity={0.3} />
            <XAxis
              dataKey="label"
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
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#subsGrad)"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--primary)", r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
