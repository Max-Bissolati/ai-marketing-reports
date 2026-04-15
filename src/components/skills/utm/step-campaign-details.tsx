"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  slugifyCampaign,
  detectPpSql,
  extractBlogContent,
  PARAM_COLORS,
  getParamExplanation,
} from "@/lib/utm-constants";
import type { ChannelOption } from "@/types/utm-types";

interface StepCampaignDetailsProps {
  url: string;
  channel: ChannelOption;
  initialCampaign: string;
  initialElement: string;
  initialContent: string;
  initialEmailAudience: string;
  initialPpSql: string;
  onBack: () => void;
  onGenerate: (data: {
    campaignName: string;
    element: string;
    contentId: string;
    emailAudience: string;
    ppSql: string;
  }) => void;
}

export function StepCampaignDetails({
  url,
  channel,
  initialCampaign,
  initialElement,
  initialContent,
  initialEmailAudience,
  initialPpSql,
  onBack,
  onGenerate,
}: StepCampaignDetailsProps) {
  const [campaignName, setCampaignName] = useState(initialCampaign);
  const [element, setElement] = useState(initialElement || channel.defaultElement);
  const [contentId, setContentId] = useState(initialContent);
  const [emailAudience, setEmailAudience] = useState(initialEmailAudience || channel.utmMedium);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-detect pp_sql and blog content
  const autoDetected = useMemo(() => {
    const ppSqlDetection = detectPpSql(url);
    const blogContent = extractBlogContent(url);
    return { ppSql: ppSqlDetection, blogContent };
  }, [url]);

  const ppSql = initialPpSql || autoDetected.ppSql?.ppSql || "";

  // Set content from blog slug if not already set
  const effectiveContent = contentId || autoDetected.blogContent || "";

  const campaignSlug = slugifyCampaign(campaignName);

  // Build live preview of UTM params
  const previewParams = useMemo(() => {
    const params: { key: string; value: string }[] = [
      { key: "utm_source", value: channel.utmSource },
      { key: "utm_medium", value: channel.category === "email" ? emailAudience : channel.utmMedium },
      { key: "utm_campaign", value: campaignSlug || "..." },
      { key: "utm_term", value: element },
    ];
    if (effectiveContent) {
      params.push({ key: "utm_content", value: effectiveContent });
    }
    if (ppSql) {
      params.push({ key: "pp_sql", value: ppSql });
    }
    return params;
  }, [channel, emailAudience, campaignSlug, element, effectiveContent, ppSql]);

  const isValid = campaignName.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onGenerate({
      campaignName: campaignSlug,
      element,
      contentId: effectiveContent,
      emailAudience: channel.category === "email" ? emailAudience : "",
      ppSql,
    });
  };

  return (
    <div className="space-y-6">
      {/* Channel badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/30">
          {channel.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {channel.utmSource} / {channel.category === "email" ? "email type" : channel.utmMedium}
        </span>
      </div>

      {/* Campaign Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Campaign Name
          <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="e.g., Payouts Launch Q1 2026"
          className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {campaignSlug && (
          <p className="text-xs text-muted-foreground font-mono">
            utm_campaign={" "}
            <span className="text-green-400">{campaignSlug}</span>
          </p>
        )}
      </div>

      {/* Element Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          What will they click?
          <span className="group relative">
            <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-popover border border-white/10 text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              The specific element on the page the user interacts with
            </span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {channel.elements.map((el) => (
            <button
              key={el}
              onClick={() => setElement(el)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-mono transition-all border",
                element === el
                  ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                  : "bg-white/[0.03] text-muted-foreground border-white/10 hover:border-white/20"
              )}
            >
              {el}
            </button>
          ))}
        </div>
      </div>

      {/* Email Audience (only for email channels) */}
      {channel.category === "email" && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Email Audience / Type
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-popover border border-white/10 text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                For email, the medium describes the audience or email type
              </span>
            </span>
          </label>
          <input
            type="text"
            value={emailAudience}
            onChange={(e) => setEmailAudience(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
            placeholder="e.g., pos_merchants, newsletter_database"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
          />
        </div>
      )}

      {/* Advanced: Content & pp_sql */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showAdvanced ? "Hide" : "Show"} advanced fields
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-4"
          >
            {/* Content ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Content Identifier (utm_content)
              </label>
              <input
                type="text"
                value={effectiveContent}
                onChange={(e) => setContentId(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                placeholder="Auto-detected from URL or enter manually"
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
              />
              {autoDetected.blogContent && !contentId && (
                <p className="text-xs text-pink-400">Auto-detected from blog slug</p>
              )}
            </div>

            {/* pp_sql */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Product Attribution (pp_sql)
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold uppercase tracking-wider">
                  SQL
                </span>
              </label>
              <input
                type="text"
                value={ppSql}
                onChange={(e) => {/* pp_sql is auto-detected, but allow override */}}
                readOnly
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-cyan-400 placeholder:text-muted-foreground/50 outline-none font-mono text-sm cursor-default"
              />
              {autoDetected.ppSql && (
                <p className="text-xs text-cyan-400">
                  Auto-detected: {autoDetected.ppSql.label} ({autoDetected.ppSql.type})
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Live Preview */}
      <div className="bento-card p-4 space-y-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Live Preview
        </span>
        <div className="flex flex-wrap gap-x-1 gap-y-1 font-mono text-xs">
          {previewParams.map((p, i) => (
            <span key={p.key}>
              {i === 0 ? (
                <span className="text-foreground/30">?</span>
              ) : (
                <span className="text-foreground/30">&</span>
              )}
              <span className="text-muted-foreground">{p.key}=</span>
              <span style={{ color: PARAM_COLORS[p.key] ?? "#F8F8F8" }} className="font-semibold">
                {p.value}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <motion.button
          onClick={handleSubmit}
          disabled={!isValid}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all",
            isValid
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,102,0,0.3)]"
              : "bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed"
          )}
        >
          Generate UTM
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
