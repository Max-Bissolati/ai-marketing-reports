"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Sparkles, Loader2, FileDown, Users, Zap, UserPlus } from "lucide-react";
import { ReportKpiCards } from "@/components/reporting/report-kpi-cards";
import { LifecycleChart } from "@/components/reporting/lifecycle-chart";
import { ChannelChart } from "@/components/reporting/channel-chart";
import { PageTrafficChart } from "@/components/reporting/page-traffic-chart";
import { LandingPageChart } from "@/components/reporting/landing-page-chart";
import { CampaignContactsTable } from "@/components/reporting/campaign-contacts-table";
import type { WWXCampaignData } from "@/types/reporting-types";

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
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function WWXDashboard() {
  const [data, setData] = useState<WWXCampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wwx-campaign-data")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading campaign data from HubSpot...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bento-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Failed to load data</h2>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "Report Downloads",
      value: data.forms.mainDownload.submissions,
      sub: "Main report form submissions",
      icon: FileDown,
      highlight: true,
    },
    {
      label: "Total Submissions",
      value: data.forms.total,
      sub: "Across all 3 forms",
      icon: Users,
    },
    {
      label: "Influenced Contacts",
      value: 3869,
      sub: "HubSpot campaign attribution",
      icon: Zap,
    },
    {
      label: "New Contacts",
      value: 166,
      sub: "First touch attribution",
      icon: UserPlus,
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto overflow-x-clip relative">
      <img
        src="/Peach Payments Pattern Background Top Section - Compressed.avif"
        alt="Background Pattern"
        className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      <div className="relative">
        {/* Sticky glass header */}
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
            <p className="text-xs text-muted-foreground">
              Updated{" "}
              {new Date(data.generatedAt).toLocaleString("en-ZA", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <button className="group relative px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-sm font-medium transition-all hover:bg-white/10 overflow-hidden bento-card">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <span className="relative flex items-center gap-2">
                Export JSON{" "}
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* KPI Cards */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            <ReportKpiCards kpis={kpis} />
          </motion.div>

          {/* Lifecycle + Channel */}
          <motion.div variants={item} className="col-span-1 md:col-span-5 flex h-full">
            <div className="w-full h-full">
              <LifecycleChart data={INFLUENCED_LIFECYCLE} />
            </div>
          </motion.div>

          <motion.div variants={item} className="col-span-1 md:col-span-7 flex h-full">
            <div className="w-full h-full">
              <ChannelChart data={[]} />
            </div>
          </motion.div>

          {/* Page Traffic — reports.peachpayments.com (Rybbit site 2) */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            <PageTrafficChart
              pathname="/"
              siteId={2}
              showTimeRange={false}
              title="Landing Page Traffic"
              description="Daily sessions for reports.peachpayments.com · GA4 data via Rybbit"
            />
          </motion.div>

          {/* Landing Pages — Sink tracking links */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            <LandingPageChart campaign="www_research_report_2025" />
          </motion.div>

          {/* Connected status card */}
          <motion.div
            variants={item}
            className="col-span-1 md:col-span-12 bento-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group"
          >
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/40 transition-colors duration-500" />
            <div>
              <h3 className="text-xl font-bold mb-1">Live Data Pipeline</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Form submissions fetched live from HubSpot API (cached 30 min).
                Landing page traffic from GA4 via Rybbit. KPI attribution metrics sourced
                from the HubSpot Campaign Dashboard and updated manually.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <span className="text-xs font-semibold text-primary">Connected to HubSpot</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34d399]" />
                </span>
                <span className="text-xs font-semibold text-[#34d399]">Connected to Rybbit</span>
              </div>
            </div>
          </motion.div>

          {/* Contacts Table */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 mt-4">
            {data.contacts.length > 0 ? (
              <CampaignContactsTable contacts={data.contacts} />
            ) : (
              <div className="bento-card p-8 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
