"use client"

import { motion, type Variants } from "framer-motion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PopupFunnelData } from "@/types/reporting-types"

interface PopupFunnelChartProps {
    data: PopupFunnelData
}

export function PopupFunnelChart({ data }: PopupFunnelChartProps) {
    const { impressions, clicks, signups, primaryCta, secondaryCta } = data

    // Calculate conversion rates
    const clickRate = ((clicks / impressions) * 100).toFixed(1)
    const signupRate = ((signups / clicks) * 100).toFixed(1)
    const overallRate = ((signups / impressions) * 100).toFixed(2)

    // Calculate widths for funnel visualization (proportional)
    const maxVal = impressions
    const impressionsWidth = 100
    const clicksWidth = (clicks / maxVal) * 100
    const signupsWidth = (signups / maxVal) * 100

    const funnelStages = [
        {
            label: "Impressions",
            value: impressions,
            width: impressionsWidth,
            color: "var(--primary)",
            description: "Users who saw the popup",
        },
        {
            label: "Clicks",
            value: clicks,
            width: clicksWidth,
            color: "var(--chart-5)",
            description: "Users who clicked a CTA",
        },
        {
            label: "Signups",
            value: signups,
            width: signupsWidth,
            color: "var(--chart-4)",
            description: "Dashboard sign-ups",
        },
    ]

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    }

    const item: Variants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
    }

    return (
        <Card className="bento-card border-0 shadow-none overflow-hidden">
            <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle className="text-2xl">Popup Funnel</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">
                            User journey from popup impression to dashboard sign-up
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                            {overallRate}% Overall Conversion
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-6">
                {/* CTA Labels */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">Primary CTA:</span>
                        <span className="text-sm font-medium">{primaryCta}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-5" />
                        <span className="text-sm text-muted-foreground">Secondary CTA:</span>
                        <span className="text-sm font-medium">{secondaryCta}</span>
                    </div>
                </div>

                {/* Horizontal Funnel Visualization */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {funnelStages.map((stage, index) => (
                        <motion.div key={stage.label} variants={item} className="relative">
                            <div className="flex items-center gap-4">
                                {/* Stage Label */}
                                <div className="w-28 flex-shrink-0">
                                    <div className="text-sm font-medium">{stage.label}</div>
                                    <div className="text-xs text-muted-foreground">{stage.description}</div>
                                </div>

                                {/* Funnel Bar */}
                                <div className="flex-1 relative">
                                    <div
                                        className="h-14 rounded-lg relative overflow-hidden transition-all duration-500"
                                        style={{
                                            width: `${Math.max(stage.width, 8)}%`,
                                            background: `linear-gradient(90deg, ${stage.color}cc, ${stage.color}66)`,
                                            boxShadow: `0 4px 20px ${stage.color}33`,
                                        }}
                                    >
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

                                        {/* Value display */}
                                        <div className="absolute inset-0 flex items-center justify-between px-4">
                                            <span className="text-lg font-bold text-white drop-shadow-sm">
                                                {stage.value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conversion rate between stages */}
                            {index < funnelStages.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.2 }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10"
                                >
                                    <div className="bg-white/[0.08] backdrop-blur-[8px] border border-white/10 rounded-full px-3 py-1 text-xs font-medium text-primary">
                                        {index === 0 ? `${clickRate}%` : `${signupRate}%`}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4"
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{clickRate}%</div>
                        <div className="text-xs text-muted-foreground mt-1">Click-through Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-chart-5">{signupRate}%</div>
                        <div className="text-xs text-muted-foreground mt-1">Click-to-Signup</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{overallRate}%</div>
                        <div className="text-xs text-muted-foreground mt-1">Overall Conversion</div>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    )
}
