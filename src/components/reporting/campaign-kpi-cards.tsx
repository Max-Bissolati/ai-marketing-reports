"use client";

import { Users, Zap, MousePointerClick, Hash } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { CampaignDashboardData } from "@/types/reporting-types";

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

interface CampaignKpiCardsProps {
  kpis: CampaignDashboardData["kpis"];
  totalBeforeFilter: number;
}

export function CampaignKpiCards({
  kpis,
  totalBeforeFilter,
}: CampaignKpiCardsProps) {
  const assistedPct =
    kpis.totalContacts > 0
      ? ((kpis.marketingAssisted / kpis.totalContacts) * 100).toFixed(0)
      : "0";

  const cards = [
    {
      label: "Attributed Contacts",
      value: kpis.totalContacts,
      sub: `${totalBeforeFilter} total (${totalBeforeFilter - kpis.totalContacts} internal filtered)`,
      icon: Users,
    },
    {
      label: "Marketing Assisted",
      value: kpis.marketingAssisted,
      sub: `${assistedPct}% of contacts`,
      icon: Zap,
      highlight: true,
    },
    {
      label: "Total Touches",
      value: kpis.totalTouches,
      sub: `Across all channels`,
      icon: MousePointerClick,
    },
    {
      label: "Avg Touches / Contact",
      value: kpis.avgTouchesPerContact,
      sub: "Marketing interactions before conversion",
      icon: Hash,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={item}
          className="bento-card p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground uppercase">
              {card.label}
            </h3>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
              <card.icon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter text-foreground mb-1">
              {typeof card.value === "number" && card.value % 1 === 0
                ? card.value.toLocaleString()
                : card.value}
            </div>
            <p
              className={`text-xs font-medium ${card.highlight ? "text-primary" : "text-muted-foreground"}`}
            >
              {card.sub}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
