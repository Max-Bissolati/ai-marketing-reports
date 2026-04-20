"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Users,
  UserPlus,
  TrendingUp,
  Eye,
  Globe,
  Banknote,
  FileDown,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LifecycleChart } from "@/components/reporting/lifecycle-chart";
import { WWXFormChart } from "@/components/reporting/wwx-form-chart";
import { WWXInfluencedChart } from "@/components/reporting/wwx-influenced-chart";
import { WWXSubmittersTable } from "@/components/reporting/wwx-submitters-table";
import { WWXPageTrafficChart } from "@/components/reporting/wwx-page-traffic-chart";
import type { WWXCampaignData, WWXPageTrafficData } from "@/types/reporting-types";

// ─── Static attribution data (source: HubSpot Campaign Dashboard) ────────────
// These metrics come from HubSpot's proprietary attribution engine and are not
// available via public API. Update manually from the HubSpot campaign dashboard.
const ATTRIBUTION_KPIS = [
  { label: "Influenced Contacts", value: "3,869", icon: Users, sub: "Campaign attribution", color: "text-primary" },
  { label: "New Contacts", value: "166", icon: UserPlus, sub: "First touch", color: "text-[#22d3ee]" },
  { label: "Campaign Revenue", value: "R 9,255", icon: Banknote, sub: "25 deals attributed", color: "text-[#34d399]" },
  { label: "Associated Deal Value", value: "R 42,555", icon: TrendingUp, sub: "Pipeline value", color: "text-[#a78bfa]" },
  { label: "CTA Views → Clicks", value: "95,025 → 517", icon: Eye, sub: "0.54% CTR", color: "text-primary" },
  { label: "Landing Page Views", value: "1,367", icon: Globe, sub: "reports.peachpayments.com", color: "text-[#22d3ee]" },
];

// Lifecycle data from HubSpot Campaign Dashboard screenshot (influenced contacts)
const INFLUENCED_LIFECYCLE = [
  { stage: "other", count: 2672 },
  { stage: "lead", count: 469 },
  { stage: "marketingqualifiedlead", count: 467 },
  { stage: "opportunity", count: 141 },
  { stage: "customer", count: 96 },
  { stage: "salesqualifiedlead", count: 44 },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function WWXDashboard() {
  const [data, setData] = useState<WWXCampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trafficData, setTrafficData] = useState<WWXPageTrafficData | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wwx-campaign-data")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetch("/api/wwx-page-traffic")
      .then((res) => res.ok ? res.json() : null)
      .then((json) => setTrafficData(json))
      .catch(() => null)
      .finally(() => setTrafficLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto overflow-x-clip relative">
      <img
        src="/Peach Payments Pattern Background Top Section - Compressed.avif"
        alt="Background Pattern"
        className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="sticky top-0 z-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative -mt-6 md:-mt-10 lg:-mt-14 -mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14 pt-6 md:pt-10 lg:pt-14 pb-6 bg-[#070a43]/[0.33] backdrop-blur-[12px] backdrop-saturate-[1.2] border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-10"
        >
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 border border-primary/30 shadow-[0_0_15px_rgba(255,102,0,0.3)]">
                <Sparkles className="w-3 h-3" />
                LIVE DATA
              </div>
              <p className="text-muted-foreground text-sm tracking-wide uppercase font-medium">
                Reporting Engine
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90 font-heading">
              <span className="text-gradient-brand italic font-black pr-1">Online Retail</span>{" "}
              <span className="font-light">Report 2025</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              World Wide Worx | 2025 · Campaign owner: Promise Mfeka
            </p>
          </div>

          <div className="flex items-center gap-3">
            {data && (
              <p className="text-xs text-muted-foreground">
                Form data updated{" "}
                {new Date(data.generatedAt).toLocaleString("en-ZA", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* ── Attribution KPI Cards (static) ──────────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Campaign Attribution
              </h2>
              <Badge className="bg-white/5 text-muted-foreground border border-white/10 text-xs">
                HubSpot Dashboard · Aug 2025 – Apr 2026
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {ATTRIBUTION_KPIS.map((kpi) => (
                <div key={kpi.label} className="bento-card p-5 flex flex-col gap-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  <p className={`text-xl font-bold tracking-tight ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs font-medium text-foreground/80 leading-tight">{kpi.label}</p>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Form Submissions Chart (live) ────────────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-8 flex h-full">
            <div className="w-full">
              {loading ? (
                <Card className="bento-card border-0 shadow-none h-full flex items-center justify-center min-h-[360px]">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </Card>
              ) : error || !data ? (
                <Card className="bento-card border-0 shadow-none h-full flex items-center justify-center min-h-[360px]">
                  <p className="text-muted-foreground text-sm">Could not load form data</p>
                </Card>
              ) : (
                <WWXFormChart
                  data={data.submissionsMonthly}
                  total={data.forms.total}
                />
              )}
            </div>
          </motion.div>

          {/* ── Form Breakdown Cards (live) ──────────────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-4 flex flex-col gap-4">
            {loading ? (
              <Card className="bento-card border-0 shadow-none flex-1 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </Card>
            ) : data ? (
              <>
                {[
                  { key: "mainDownload" as const, label: "Report Download Form", icon: FileDown, color: "text-primary" },
                  { key: "blogVersion" as const, label: "Blog Version", icon: FileDown, color: "text-[#22d3ee]" },
                  { key: "rsvp" as const, label: "RSVP Form", icon: FileDown, color: "text-[#a78bfa]" },
                ].map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="bento-card p-5 flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${color}`}>
                        {data.forms[key].submissions.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">submissions</p>
                    </div>
                  </div>
                ))}
                <div className="bento-card p-5 flex items-center justify-between bg-primary/10 border border-primary/20">
                  <span className="text-sm font-semibold">Total Submissions</span>
                  <p className="text-2xl font-black text-primary">{data.forms.total.toLocaleString()}</p>
                </div>
              </>
            ) : null}
          </motion.div>

          {/* ── Lifecycle Chart (static) ─────────────────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-5 flex h-full">
            <div className="w-full h-full">
              <LifecycleChart data={INFLUENCED_LIFECYCLE} />
            </div>
          </motion.div>

          {/* ── Influenced Contacts Monthly (static) ─────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-7 flex h-full">
            <div className="w-full h-full">
              <WWXInfluencedChart />
            </div>
          </motion.div>

          {/* ── Landing Page Traffic (GA4 live) ─────────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            {trafficLoading ? (
              <Card className="bento-card border-0 shadow-none flex items-center justify-center min-h-[280px]">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </Card>
            ) : trafficData ? (
              <WWXPageTrafficChart data={trafficData} />
            ) : null}
          </motion.div>

          {/* ── CTA & Asset Performance (static) ────────────────────────── */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Asset Performance
              </h2>
              <Badge className="bg-white/5 text-muted-foreground border border-white/10 text-xs">
                HubSpot Dashboard
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bento-card p-6 relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors duration-500" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">CTA (Online Retail Report 2025)</p>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">95,025</p>
                    <p className="text-xs text-muted-foreground mt-0.5">views</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground mb-2" />
                  <div>
                    <p className="text-3xl font-bold text-[#22d3ee]">517</p>
                    <p className="text-xs text-muted-foreground mt-0.5">clicks</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">0.54% click-through rate</p>
              </div>

              <div className="bento-card p-6 relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#22d3ee]/10 rounded-full blur-[40px] group-hover:bg-[#22d3ee]/20 transition-colors duration-500" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">External Landing Page</p>
                <p className="text-3xl font-bold text-[#22d3ee]">1,367</p>
                <p className="text-xs text-muted-foreground mt-0.5">views</p>
                <p className="text-xs text-muted-foreground mt-2">reports.peachpayments.com</p>
              </div>

              <div className="bento-card p-6 relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#a78bfa]/10 rounded-full blur-[40px] group-hover:bg-[#a78bfa]/20 transition-colors duration-500" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Blog Post</p>
                <p className="text-3xl font-bold text-[#a78bfa]">104</p>
                <p className="text-xs text-muted-foreground mt-0.5">views</p>
                <p className="text-xs text-muted-foreground mt-2">Highlights from the 2025 WWX Online Retail Report</p>
              </div>
            </div>
          </motion.div>

          {/* ── Connected Status Card ────────────────────────────────────── */}
          <motion.div
            variants={item}
            className="col-span-1 md:col-span-12 bento-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group"
          >
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/40 transition-colors duration-500" />
            <div>
              <h3 className="text-xl font-bold mb-1">Data Sources</h3>
              <p className="text-muted-foreground text-sm max-w-lg">
                Form submissions fetched live from HubSpot API (cached 30 min). Landing page traffic fetched
                live from Google Analytics 4 via N8N (cached 30 min). Attribution metrics sourced from the
                HubSpot Campaign Dashboard — these use HubSpot&apos;s proprietary influence attribution
                model and are updated manually.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-xs font-semibold text-primary">Live · HubSpot Form API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34d399]" />
                </span>
                <span className="text-xs font-semibold text-[#34d399]">Live · Google Analytics 4 via N8N</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted-foreground" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Static · HubSpot Attribution Dashboard</span>
              </div>
            </div>
          </motion.div>

          {/* ── Report Downloaders Table (live) ──────────────────────────── */}
          {!loading && data && data.recentSubmitters.length > 0 && (
            <motion.div variants={item} className="col-span-1 md:col-span-12 mt-4">
              <WWXSubmittersTable submitters={data.recentSubmitters} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
