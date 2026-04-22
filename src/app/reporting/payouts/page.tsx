"use client";

import { useState, useEffect } from "react";
import { MetricsCards } from "@/components/reporting/metrics-cards";
import { CampaignCharts } from "@/components/reporting/campaign-charts";
import { MqlTable } from "@/components/reporting/mql-table";
import { PopupFunnelChart } from "@/components/reporting/popup-funnel-chart";
import { CampaignPageChart } from "@/components/reporting/campaign-page-chart";
import { ArticlesTable } from "@/components/reporting/articles-table";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { PopupFunnelData } from "@/types/reporting-types";

const USERPILOT_EXPERIENCE_ID = "52R3uhzX8i";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function PayoutsDashboard() {
  const [funnelData, setFunnelData] = useState<PopupFunnelData | null>(null);
  const [funnelLoading, setFunnelLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/userpilot/funnel?experienceId=${USERPILOT_EXPERIENCE_ID}`)
      .then((r) => r.json())
      .then((d) => setFunnelData(d))
      .catch(() => setFunnelData(null))
      .finally(() => setFunnelLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto overflow-x-clip relative">
      {/* Fixed background image - stays in standard z-index but is pointer-events-none */}
      <img
        src="/Peach Payments Pattern Background Top Section - Compressed.avif"
        alt="Background Pattern"
        className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      <div className="relative">
        {/* Premium glowing header with glass effect */}
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
              <p className="text-muted-foreground text-sm tracking-wide uppercase font-medium">Reporting Engine</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90 font-heading">
              <span className="text-gradient-brand italic font-black pr-1">Payouts</span> <span className="font-light">Campaign</span>
            </h1>
          </div>

          <button className="group relative px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-sm font-medium transition-all hover:bg-white/10 overflow-hidden bento-card">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            <span className="relative flex items-center gap-2">
              Export JSON <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Top KPIs Row */}
          <div className="col-span-1 md:col-span-12">
            <MetricsCards />
          </div>

          {/* Popup Funnel Chart - Full width, top priority */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 relative z-10">
            <PopupFunnelChart data={funnelData} loading={funnelLoading} />
          </motion.div>

          {/* Campaign Landing Page Chart */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 relative z-10">
            <CampaignPageChart />
          </motion.div>

          {/* Bento Box Row 2 */}
          <motion.div variants={item} className="col-span-1 md:col-span-5 flex h-full">
            <div className="w-full h-full">
              <CampaignCharts type="lifecycle" />
            </div>
          </motion.div>

          <motion.div variants={item} className="col-span-1 md:col-span-7 flex flex-col gap-6">
            <div className="h-full">
              <CampaignCharts type="email" />
            </div>
          </motion.div>

          {/* Bento Box Row 3 */}
          <motion.div variants={item} className="col-span-1 md:col-span-4">
            <CampaignCharts type="linkedin" />
          </motion.div>

          <motion.div variants={item} className="col-span-1 md:col-span-4">
            <CampaignCharts type="youtube" />
          </motion.div>

          <motion.div variants={item} className="col-span-1 md:col-span-4 bento-card p-8 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/40 transition-colors duration-500" />
            <h3 className="text-xl font-bold mb-2">Automated Data Sync</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-[200px]">N8N scheduled workflows capture CRM & Social metrics weekly.</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold text-primary">Connected to HubSpot</span>
            </div>
          </motion.div>

          {/* Articles Table - Full width */}
          <motion.div variants={item} className="col-span-1 md:col-span-12">
            <ArticlesTable />
          </motion.div>

          {/* Full width MQL Table acting as the anchor to the dashboard */}
          <motion.div variants={item} className="col-span-1 md:col-span-12 mt-4">
            <MqlTable />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
