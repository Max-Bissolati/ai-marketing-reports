"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface ReportKpi {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  highlight?: boolean;
}

interface ReportKpiCardsProps {
  kpis: ReportKpi[];
}

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export function ReportKpiCards({ kpis }: ReportKpiCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((card) => (
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
              {typeof card.value === "number" && Number.isInteger(card.value)
                ? card.value.toLocaleString()
                : card.value}
            </div>
            <p className={`text-xs font-medium ${card.highlight ? "text-primary" : "text-muted-foreground"}`}>
              {card.sub}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
