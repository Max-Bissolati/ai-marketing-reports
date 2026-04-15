"use client";

import { Users, MousePointerClick, Eye, UserPlus } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export function MetricsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <motion.div variants={item} className="bento-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="text-sm font-medium tracking-tight text-muted-foreground uppercase">
            Total Target Leads
          </h3>
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
             <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div>
          <div className="text-4xl font-black tracking-tighter text-foreground mb-1">118</div>
          <p className="text-xs text-muted-foreground font-medium">
            HubSpot Target List
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bento-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="text-sm font-medium tracking-tight text-muted-foreground uppercase">
            Dashboard Signups
          </h3>
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
            <UserPlus className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div>
          <div className="text-4xl font-black tracking-tighter text-foreground mb-1">35</div>
          <p className="text-xs text-primary font-medium">
            +29.6% Conversion
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bento-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="text-sm font-medium tracking-tight text-muted-foreground uppercase">
            Dashboard Views
          </h3>
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
             <Eye className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div>
          <div className="text-4xl font-black tracking-tighter text-foreground mb-1">2,546</div>
          <p className="text-xs text-primary font-medium">
            +20.1% vs Last Month
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bento-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h3 className="text-sm font-medium tracking-tight text-muted-foreground uppercase">
            Click-Throughs
          </h3>
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
            <MousePointerClick className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div>
          <div className="text-4xl font-black tracking-tighter text-foreground mb-1">103</div>
          <p className="text-xs text-primary font-medium">
            +4.05% CTR
          </p>
        </div>
      </motion.div>
    </div>
  );
}
