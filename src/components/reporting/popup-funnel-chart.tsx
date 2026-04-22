"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, type Variants } from "framer-motion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, AlertCircle, Loader2 } from "lucide-react"
import type { PopupFunnelData } from "@/types/reporting-types"

interface PopupFunnelChartProps {
    campaignSlug: string
}

export function PopupFunnelChart({ campaignSlug }: PopupFunnelChartProps) {
    const [data, setData] = useState<PopupFunnelData | null>(null)
    const [loading, setLoading] = useState(true)
    const [input, setInput] = useState("")
    const [primaryCta, setPrimaryCta] = useState("")
    const [secondaryCta, setSecondaryCta] = useState("")
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/userpilot/funnel?campaignSlug=${encodeURIComponent(campaignSlug)}`)
            const json = await res.json()
            setData(json)
        } catch {
            setData(null)
        } finally {
            setLoading(false)
        }
    }, [campaignSlug])

    useEffect(() => { fetchData() }, [fetchData])

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setSaveError(null)
        try {
            const res = await fetch("/api/userpilot/funnel/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ campaignSlug, input, primaryCta, secondaryCta }),
            })
            const result = await res.json()
            if (!result.success) {
                setSaveError(result.error ?? "Could not register flow")
                return
            }
            await fetchData()
        } catch {
            setSaveError("Network error — please try again")
        } finally {
            setSaving(false)
        }
    }

    // --- Loading skeleton ---
    if (loading) {
        return (
            <Card className="bento-card border-0 shadow-none overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-2xl">Popup Funnel</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                        User journey from popup impression to dashboard sign-up
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-6">
                    <div className="space-y-4">
                        {[100, 60, 30].map((w, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-28 flex-shrink-0 space-y-1">
                                    <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                                    <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
                                </div>
                                <div className="flex-1">
                                    <div className="h-14 rounded-lg bg-white/5 animate-pulse" style={{ width: `${w}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // --- Configure UI (no data registered yet) ---
    if (!data) {
        return (
            <Card className="bento-card border-0 shadow-none overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-2xl">Popup Funnel</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">
                        User journey from popup impression to dashboard sign-up
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8 pt-6">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-start gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <BarChart3 className="w-5 h-5 text-primary/60" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground/80">Connect a Userpilot flow</p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Paste the numeric flow ID from the Userpilot URL
                                    (<span className="font-mono text-primary/70">/flows/126/analytics</span>)
                                    or the permalink copied from the Userpilot share button
                                    (<span className="font-mono text-primary/70">?userpilot=ZXhw…</span>).
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Flow ID or Permalink <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="e.g.  126  or  ?userpilot=ZXhwZXJpZW5jZTo1MlIzdWh6WDhp"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Primary CTA label
                                    </label>
                                    <input
                                        type="text"
                                        value={primaryCta}
                                        onChange={e => setPrimaryCta(e.target.value)}
                                        placeholder="e.g. Payouts Web page"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Secondary CTA label
                                    </label>
                                    <input
                                        type="text"
                                        value={secondaryCta}
                                        onChange={e => setSecondaryCta(e.target.value)}
                                        placeholder="e.g. Dev docs page"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                                    />
                                </div>
                            </div>

                            {saveError && (
                                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {saveError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving || !input.trim()}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {saving ? "Connecting…" : "Connect flow"}
                            </button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // --- Chart view ---
    const { impressions, clicks, signups, primaryCta: pCta, secondaryCta: sCta } = data
    const clickRate = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0"
    const signupRate = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : "0.0"
    const overallRate = impressions > 0 ? ((signups / impressions) * 100).toFixed(2) : "0.00"

    const maxVal = impressions || 1
    const funnelStages = [
        { label: "Impressions", value: impressions, width: 100, color: "var(--primary)", description: "Users who saw the popup" },
        { label: "Clicks", value: clicks, width: (clicks / maxVal) * 100, color: "var(--chart-5)", description: "Users who clicked a CTA" },
        { label: "Signups", value: signups, width: (signups / maxVal) * 100, color: "var(--chart-4)", description: "Dashboard sign-ups" },
    ]

    const container: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } },
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
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                        {overallRate}% Overall Conversion
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-6">
                <div className="flex flex-wrap gap-4 mb-8">
                    {pCta && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-sm text-muted-foreground">Primary CTA:</span>
                            <span className="text-sm font-medium">{pCta}</span>
                        </div>
                    )}
                    {sCta && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-chart-5" />
                            <span className="text-sm text-muted-foreground">Secondary CTA:</span>
                            <span className="text-sm font-medium">{sCta}</span>
                        </div>
                    )}
                </div>

                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                    {funnelStages.map((stage, index) => (
                        <motion.div key={stage.label} variants={item} className="relative">
                            <div className="flex items-center gap-4">
                                <div className="w-28 flex-shrink-0">
                                    <div className="text-sm font-medium">{stage.label}</div>
                                    <div className="text-xs text-muted-foreground">{stage.description}</div>
                                </div>
                                <div className="flex-1 relative">
                                    <div
                                        className="h-14 rounded-lg relative overflow-hidden transition-all duration-500"
                                        style={{
                                            width: `${Math.max(stage.width, 8)}%`,
                                            background: `linear-gradient(90deg, ${stage.color}cc, ${stage.color}66)`,
                                            boxShadow: `0 4px 20px ${stage.color}33`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                                        <div className="absolute inset-0 flex items-center px-4">
                                            <span className="text-lg font-bold text-white drop-shadow-sm">
                                                {stage.value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
