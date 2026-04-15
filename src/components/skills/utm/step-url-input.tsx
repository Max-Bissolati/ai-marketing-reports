"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link2, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHANNEL_OPTIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  detectPpSql,
  extractBlogContent,
} from "@/lib/utm-constants";
import type { ChannelOption } from "@/types/utm-types";

interface StepUrlInputProps {
  initialUrl: string;
  initialChannel: ChannelOption | null;
  onNext: (url: string, channel: ChannelOption) => void;
}

export function StepUrlInput({ initialUrl, initialChannel, onNext }: StepUrlInputProps) {
  const [url, setUrl] = useState(initialUrl);
  const [selectedChannel, setSelectedChannel] = useState<ChannelOption | null>(initialChannel);

  const urlAnalysis = useMemo(() => {
    if (!url) return null;
    try {
      new URL(url);
    } catch {
      return null;
    }
    const ppSql = detectPpSql(url);
    const blogContent = extractBlogContent(url);
    return { ppSql, blogContent };
  }, [url]);

  const isValid = url.length > 0 && selectedChannel !== null;

  const grouped = useMemo(() => {
    const map = new Map<string, ChannelOption[]>();
    for (const ch of CHANNEL_OPTIONS) {
      const arr = map.get(ch.category) ?? [];
      arr.push(ch);
      map.set(ch.category, arr);
    }
    return map;
  }, []);

  const handleSubmit = () => {
    if (!isValid || !selectedChannel) return;
    onNext(url, selectedChannel);
  };

  return (
    <div className="space-y-8">
      {/* URL Input */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link2 className="w-4 h-4" />
          Destination URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.peachpayments.com/products/payouts"
          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base font-mono"
        />

        {/* Auto-detection badges */}
        {urlAnalysis && (
          <div className="flex flex-wrap gap-2">
            {urlAnalysis.ppSql && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                pp_sql: {urlAnalysis.ppSql.ppSql}
                <span className="text-cyan-400/60">({urlAnalysis.ppSql.type})</span>
              </motion.span>
            )}
            {urlAnalysis.blogContent && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                content: {urlAnalysis.blogContent}
              </motion.span>
            )}
          </div>
        )}
      </div>

      {/* Channel Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Where will this link live?
        </h3>

        {CATEGORY_ORDER.map((category) => {
          const channels = grouped.get(category);
          if (!channels) return null;

          return (
            <div key={category} className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                {CATEGORY_LABELS[category]}
              </span>
              <div className="flex flex-wrap gap-2">
                {channels.map((ch) => {
                  const isSelected = selectedChannel?.id === ch.id;
                  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[ch.icon];

                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannel(ch)}
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                        "border bg-white/[0.03] hover:bg-white/[0.06]",
                        isSelected
                          ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,102,0,0.15)]"
                          : "border-white/10 text-foreground/70 hover:border-white/20"
                      )}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {ch.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!isValid}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all",
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,102,0,0.3)]"
            : "bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed"
        )}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
