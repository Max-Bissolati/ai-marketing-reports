"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
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
import type { CampaignPageDataPoint } from "@/types/reporting-types"

interface CampaignPageChartProps {
    data?: CampaignPageDataPoint[]
    title?: string
    description?: string
}

// Generate mock data for the campaign page
const generateCampaignPageData = (days: number): CampaignPageDataPoint[] => {
    const data: CampaignPageDataPoint[] = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)

        // Generate realistic-looking data with some variance
        const baseViews = 120 + Math.sin(i / 8) * 40
        const baseClicks = 25 + Math.sin(i / 10) * 10
        const baseConversions = 5 + Math.sin(i / 12) * 3

        data.push({
            date: currentDate.toISOString().split('T')[0],
            views: Math.floor(baseViews + Math.random() * 30 + i * 0.5),
            clicks: Math.floor(baseClicks + Math.random() * 8 + i * 0.2),
            conversions: Math.floor(baseConversions + Math.random() * 2 + i * 0.05),
        })
    }
    return data
}

const chartConfig = {
    views: {
        label: "Page Views",
        color: "var(--primary)",
    },
    clicks: {
        label: "Clicks",
        color: "var(--chart-5)",
    },
    conversions: {
        label: "Conversions",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
}

export function CampaignPageChart({
    data,
    title = "Campaign Landing Page",
    description = "Performance metrics for the Payouts campaign landing page"
}: CampaignPageChartProps) {
    const [timeRange, setTimeRange] = React.useState("90d")

    // Use provided data or generate mock data
    const chartData = data || generateCampaignPageData(90)

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date()
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
        <motion.div variants={item}>
            <Card className="bento-card border-0 shadow-none">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-6 sm:flex-row">
                    <div className="grid flex-1 gap-1">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
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
                                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillConversions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-conversions)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-conversions)" stopOpacity={0.1} />
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
                                dataKey="conversions"
                                type="natural"
                                fill="url(#fillConversions)"
                                stroke="var(--color-conversions)"
                                strokeWidth={2}
                            />
                            <Area
                                dataKey="clicks"
                                type="natural"
                                fill="url(#fillClicks)"
                                stroke="var(--color-clicks)"
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
        </motion.div>
    )
}
