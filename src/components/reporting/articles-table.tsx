"use client"

import { motion, type Variants } from "framer-motion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { ArticlePerformance } from "@/types/reporting-types"

interface ArticlesTableProps {
    data?: ArticlePerformance[]
    categoryLabel?: string
}

// Mock articles data with payouts theme
const mockArticlesData: ArticlePerformance[] = [
    {
        id: "1",
        title: "How to Set Up Payouts for Your Business",
        url: "/blog/how-to-set-up-payouts",
        views: 1842,
        uniqueVisitors: 1567,
        avgTimeOnPage: 245,
        bounceRate: 32,
        conversions: 28,
    },
    {
        id: "2",
        title: "Payouts Integration Guide",
        url: "/blog/payouts-integration-guide",
        views: 1523,
        uniqueVisitors: 1289,
        avgTimeOnPage: 312,
        bounceRate: 28,
        conversions: 35,
    },
    {
        id: "3",
        title: "Understanding Payout Schedules",
        url: "/blog/understanding-payout-schedules",
        views: 1245,
        uniqueVisitors: 1056,
        avgTimeOnPage: 198,
        bounceRate: 41,
        conversions: 18,
    },
    {
        id: "4",
        title: "Payouts vs Manual Transfers",
        url: "/blog/payouts-vs-manual-transfers",
        views: 987,
        uniqueVisitors: 834,
        avgTimeOnPage: 267,
        bounceRate: 35,
        conversions: 22,
    },
    {
        id: "5",
        title: "Optimizing Your Payout Flow",
        url: "/blog/optimizing-payout-flow",
        views: 876,
        uniqueVisitors: 723,
        avgTimeOnPage: 289,
        bounceRate: 29,
        conversions: 15,
    },
    {
        id: "6",
        title: "Payouts API Documentation Overview",
        url: "/blog/payouts-api-overview",
        views: 654,
        uniqueVisitors: 512,
        avgTimeOnPage: 423,
        bounceRate: 22,
        conversions: 31,
    },
    {
        id: "7",
        title: "Common Payout Issues and Solutions",
        url: "/blog/common-payout-issues",
        views: 543,
        uniqueVisitors: 467,
        avgTimeOnPage: 178,
        bounceRate: 45,
        conversions: 12,
    },
]

const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
}

// Helper to format time from seconds to readable format
const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
}

export function ArticlesTable({ data, categoryLabel = "payouts" }: ArticlesTableProps) {
    const articlesData = data || mockArticlesData
    const totalViews = articlesData.reduce((sum, article) => sum + article.views, 0)
    const totalConversions = articlesData.reduce((sum, article) => sum + article.conversions, 0)

    return (
        <motion.div variants={item}>
            <Card className="bento-card border-0 shadow-none overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <CardTitle className="text-2xl">Related Articles</CardTitle>
                            <CardDescription className="text-muted-foreground mt-1">
                                Blog articles tagged with "{categoryLabel}" category
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-white/5 text-muted-foreground border border-white/10">
                                {articlesData.length} Articles
                            </Badge>
                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                                {totalConversions} Conversions
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                    <Table>
                        <TableHeader className="bg-black/20">
                            <TableRow className="border-b border-white/5 hover:bg-transparent">
                                <TableHead className="font-semibold text-muted-foreground py-4">Article Title</TableHead>
                                <TableHead className="font-semibold text-muted-foreground py-4 text-right">Views</TableHead>
                                <TableHead className="font-semibold text-muted-foreground py-4 text-right">Unique Visitors</TableHead>
                                <TableHead className="font-semibold text-muted-foreground py-4 text-right">Avg. Time on Page</TableHead>
                                <TableHead className="font-semibold text-muted-foreground py-4 text-right">Bounce Rate</TableHead>
                                <TableHead className="font-semibold text-muted-foreground py-4 text-right">Conversions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articlesData.map((article, index) => (
                                <motion.tr
                                    key={article.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                >
                                    <TableCell className="font-medium py-5">
                                        <a
                                            href={article.url}
                                            className="hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                            {article.title}
                                            <svg
                                                className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-right py-5 font-medium">
                                        {article.views.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right py-5 text-muted-foreground">
                                        {article.uniqueVisitors.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right py-5 text-muted-foreground">
                                        {formatTime(article.avgTimeOnPage)}
                                    </TableCell>
                                    <TableCell className="text-right py-5">
                                        <span className={`${article.bounceRate < 30 ? "text-green-400" : article.bounceRate > 40 ? "text-red-400" : "text-muted-foreground"}`}>
                                            {article.bounceRate}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-5">
                                        <span className={`${article.conversions > 25 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                            {article.conversions}
                                        </span>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Summary row */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total across {articlesData.length} articles</span>
                        <div className="flex gap-8">
                            <span className="font-medium">{totalViews.toLocaleString()} views</span>
                            <span className="font-medium text-primary">{totalConversions} conversions</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
