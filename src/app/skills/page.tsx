"use client";

import { motion } from "framer-motion";
import { Link2, PenTool, BarChart3, Mail } from "lucide-react";
import { SkillCardStack, type SkillCard } from "@/components/skills/skill-card-stack";

const skills: SkillCard[] = [
  {
    id: "utm-builder",
    title: "UTM Builder",
    description:
      "Create perfectly tagged UTM URLs with auto-detected products, QR codes for print, and educational explanations for every parameter.",
    href: "/skills/utm-builder",
    icon: <Link2 className="w-5 h-5 text-primary" />,
    color: "bg-primary/10 border-primary/30",
    status: "active",
  },
  {
    id: "content-brief",
    title: "Content Brief Generator",
    description:
      "Generate SEO-optimized content briefs with keyword research, competitor analysis, and structured outlines.",
    href: "/skills/content-brief",
    icon: <PenTool className="w-5 h-5 text-purple-400" />,
    color: "bg-purple-500/10 border-purple-500/30",
    status: "coming-soon",
  },
  {
    id: "campaign-report",
    title: "Campaign Reporter",
    description:
      "Pull campaign performance data from GA4, Rybbit, and HubSpot into a single visual report.",
    href: "/skills/campaign-report",
    icon: <BarChart3 className="w-5 h-5 text-green-400" />,
    color: "bg-green-500/10 border-green-500/30",
    status: "coming-soon",
  },
  {
    id: "email-preview",
    title: "Email Preview & QA",
    description:
      "Preview email templates across clients, check links, validate UTMs, and test subject lines.",
    href: "/skills/email-preview",
    icon: <Mail className="w-5 h-5 text-blue-400" />,
    color: "bg-blue-500/10 border-blue-500/30",
    status: "coming-soon",
  },
];

export default function SkillsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="text-center mb-16 space-y-3"
      >
        <h1 className="text-4xl font-heading tracking-tight">
          <span className="text-gradient-brand">Marketing Skills</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Autonomous tools that help your team move faster with fewer mistakes.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.15 }}
      >
        <SkillCardStack cards={skills} />
      </motion.div>
    </div>
  );
}
