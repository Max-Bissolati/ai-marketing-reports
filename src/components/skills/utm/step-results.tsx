"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { UTMUrlDisplay } from "./utm-url-display";
import { UTMParamExplanation } from "./utm-param-explanation";
import { QRCodeCard } from "./qr-code-card";
import type { UTMResult } from "@/types/utm-types";

interface StepResultsProps {
  result: UTMResult;
  onReset: () => void;
}

export function StepResults({ result, onReset }: StepResultsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold">Your UTM is Ready</h2>
            <p className="text-xs text-muted-foreground">All parameters validated and link shortened</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Create Another
        </button>
      </motion.div>

      {/* QA Checks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.05 }}
        className="flex flex-wrap gap-2"
      >
        {result.qaChecks.map((check) => (
          <span
            key={check.label}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              check.passed
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {check.passed ? "✓" : "✗"} {check.label}
          </span>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* URL Display + Explanations (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <UTMUrlDisplay fullUrl={result.fullUrl} shortLink={result.shortLink} />
          <UTMParamExplanation params={result.params} />
        </div>

        {/* QR Code (1/3 width) — only for print/physical */}
        {result.requiresQR && result.shortLink && (
          <div className="lg:col-span-1">
            <QRCodeCard shortLink={result.shortLink} />
          </div>
        )}
      </div>
    </div>
  );
}
