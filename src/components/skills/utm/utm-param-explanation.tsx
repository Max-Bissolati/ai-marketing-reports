"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PARAM_COLORS } from "@/lib/utm-constants";
import type { UTMParamResult } from "@/types/utm-types";

interface UTMParamExplanationProps {
  params: UTMParamResult[];
}

export function UTMParamExplanation({ params }: UTMParamExplanationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      className="bento-card p-5"
    >
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Why These Parameters?
      </h3>
      <Accordion>
        {params.map((param, index) => (
          <AccordionItem key={param.key} value={index}>
            <AccordionTrigger className="hover:no-underline py-3 px-2 -mx-2 rounded-lg hover:bg-white/5">
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: PARAM_COLORS[param.key] ?? "#888" }}
                />
                <span className="font-mono text-sm text-muted-foreground">
                  {param.key}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono" style={{ color: PARAM_COLORS[param.key] ?? "#F8F8F8" }}>
                  {param.value}
                </span>
                {param.key === "pp_sql" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold uppercase tracking-wider">
                    SQL
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                {param.explanation}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
