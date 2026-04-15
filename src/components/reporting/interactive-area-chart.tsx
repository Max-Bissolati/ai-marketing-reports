"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const generateChartData = () => {
  const data = [];
  const startDate = new Date("2024-04-01");

  // Generate sine waves to simulate beautiful smooth dummy data
  for (let i = 0; i <= 90; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Campaign Website Page performance (e.g., Payouts page)
    const campaignPage = Math.floor(150 + Math.sin(i / 12) * 80 + i * 2.5);
    // Blog Articles performance (articles with same category tag)
    const blogArticles = Math.floor(100 + Math.sin(i / 12 + 0.5) * 60 + i * 1.8);

    data.push({
      date: currentDate.toISOString().split('T')[0],
      campaignPage,
      blogArticles
    });
  }
  return data;
};

const chartData = generateChartData();

const chartConfig = {
  campaignPage: {
    label: "Campaign Page",
    color: "var(--primary)", // Main vivid orange
  },
  blogArticles: {
    label: "Blog Articles",
    color: "var(--chart-5)", // Lighter orange
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="bento-card border-0 shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-6 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Campaign Page vs Blog Articles</CardTitle>
          <CardDescription>
            Performance comparison for the Payouts Campaign
          </CardDescription>
        </div>
        <div className="flex rounded-xl overflow-hidden bg-white/[0.04] backdrop-blur-[12px] backdrop-saturate-[1.2] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <button
            onClick={() => setTimeRange("90d")}
            className={`relative px-4 py-1.5 text-sm transition-all overflow-hidden ${timeRange === "90d"
              ? "font-medium text-white bg-white/10"
              : "bg-transparent text-muted-foreground hover:bg-white/5"
              }`}
          >
            {timeRange === "90d" && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
            )}
            <span className="relative">Last 3 months</span>
          </button>
          <div className="w-[1px] bg-white/10"></div>
          <button
            onClick={() => setTimeRange("30d")}
            className={`relative px-4 py-1.5 text-sm transition-all overflow-hidden ${timeRange === "30d"
              ? "font-medium text-white bg-white/10"
              : "bg-transparent text-muted-foreground hover:bg-white/5"
              }`}
          >
            {timeRange === "30d" && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
            )}
            <span className="relative">Last 30 days</span>
          </button>
          <div className="w-[1px] bg-white/10"></div>
          <button
            onClick={() => setTimeRange("7d")}
            className={`relative px-4 py-1.5 text-sm transition-all overflow-hidden ${timeRange === "7d"
              ? "font-medium text-white bg-white/10"
              : "bg-transparent text-muted-foreground hover:bg-white/5"
              }`}
          >
            {timeRange === "7d" && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
            )}
            <span className="relative">Last 7 days</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCampaignPage" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-campaignPage)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-campaignPage)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBlogArticles" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-blogArticles)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-blogArticles)"
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="blogArticles"
              type="natural"
              fill="url(#fillBlogArticles)"
              stroke="var(--color-blogArticles)"
              strokeWidth={2}
            />
            <Area
              dataKey="campaignPage"
              type="natural"
              fill="url(#fillCampaignPage)"
              stroke="var(--color-campaignPage)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
