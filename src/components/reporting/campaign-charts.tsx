"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const lifecycleData = [
  { stage: "MQL", count: 20 },
  { stage: "SQL", count: 12 },
  { stage: "Opportunity", count: 5 },
  { stage: "Customer", count: 1 },
]

const lifecycleConfig = {
  count: {
    label: "Count",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const emailData = [
  { blast: "Blast 1 (Feb 5)", opens: 60, clicks: 15 },
  { blast: "Blast 2 (Feb 12)", opens: 65, clicks: 18 },
  { blast: "Blast 3 (Feb 19)", opens: 55, clicks: 12 },
  { blast: "Blast 4 (Feb 26)", opens: 70, clicks: 22 },
]

const emailConfig = {
  opens: {
    label: "Opens",
    color: "var(--primary)",
  },
  clicks: {
    label: "Clicks",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const linkedinData = [
  { metric: "Impressions", value: 3500 },
  { metric: "Clicks", value: 120 },
  { metric: "Cost ($)", value: 450 },
]

const youtubeData = [
  { metric: "Views", value: 1200 },
  { metric: "Watch (Hours)", value: 85 },
  { metric: "Cost ($)", value: 300 },
]

const socialConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function CampaignCharts({ type }: { type: "lifecycle" | "email" | "linkedin" | "youtube" }) {
  if (type === "lifecycle") {
    return (
      <Card className="bento-card border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle>Sales Lifecycle Stages</CardTitle>
          <CardDescription>Funnel progression from HubSpot</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lifecycleConfig} className="max-h-[250px] w-full mt-4">
            <BarChart data={lifecycleData} layout="vertical" margin={{ left: 0, right: 0 }}>
              <CartesianGrid horizontal={false} opacity={0.3} />
              <YAxis
                dataKey="stage"
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip cursor={{fill: 'rgba(255,102,0,0.05)'}} content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  if (type === "email") {
    return (
      <Card className="bento-card border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle>Email Workflow Performance</CardTitle>
          <CardDescription>Performance of 4 Email Blasts</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={emailConfig} className="max-h-[250px] w-full mt-4">
            <BarChart data={emailData}>
              <CartesianGrid vertical={false} opacity={0.3} />
              <XAxis
                dataKey="blast"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <ChartTooltip cursor={{fill: 'rgba(255,102,0,0.05)'}} content={<ChartTooltipContent />} />
              <Bar dataKey="opens" fill="var(--color-opens)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }

  if (type === "linkedin") { return renderSocialChart("LinkedIn Performance", linkedinData) }
  if (type === "youtube") { return renderSocialChart("YouTube Performance", youtubeData) }

  return null
}

function renderSocialChart(title: string, data: any[]) {
    return (
        <Card className="bento-card border-0 shadow-none h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={socialConfig} className="max-h-[180px] w-full mt-2">
            <BarChart data={data}>
              <CartesianGrid vertical={false} opacity={0.3} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={11}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <ChartTooltip cursor={{fill: 'rgba(255,102,0,0.05)'}} content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
}
