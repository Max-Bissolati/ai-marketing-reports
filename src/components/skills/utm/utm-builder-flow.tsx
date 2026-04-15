"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { StepUrlInput } from "./step-url-input";
import { StepCampaignDetails } from "./step-campaign-details";
import { StepResults } from "./step-results";
import {
  PARAM_COLORS,
  getParamExplanation,
  detectPpSql,
  extractBlogContent,
} from "@/lib/utm-constants";
import type {
  ChannelOption,
  UTMFormData,
  UTMFlowState,
  UTMResult,
  UTMParamResult,
  QACheck,
} from "@/types/utm-types";

const stepVariants = {
  enter: { opacity: 0, y: 30, scale: 0.95 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

const stepWidths: Record<UTMFlowState, string> = {
  "url-input": "max-w-2xl",
  "campaign-details": "max-w-2xl",
  review: "max-w-2xl",
  loading: "max-w-md",
  results: "max-w-5xl",
};

const INITIAL_FORM: UTMFormData = {
  url: "",
  channel: null,
  campaignName: "",
  element: "",
  contentId: "",
  emailAudience: "",
  ppSql: "",
};

// Build UTM result client-side (mock when N8N isn't connected yet)
function buildUTMResult(formData: UTMFormData): UTMResult {
  const channel = formData.channel!;
  const medium =
    channel.category === "email" && formData.emailAudience
      ? formData.emailAudience
      : channel.utmMedium;

  const params: UTMParamResult[] = [
    {
      key: "utm_source",
      value: channel.utmSource,
      explanation: getParamExplanation("utm_source", channel.utmSource, channel),
      color: PARAM_COLORS.utm_source,
    },
    {
      key: "utm_medium",
      value: medium,
      explanation: getParamExplanation("utm_medium", medium, channel),
      color: PARAM_COLORS.utm_medium,
    },
    {
      key: "utm_campaign",
      value: formData.campaignName,
      explanation: getParamExplanation("utm_campaign", formData.campaignName, channel),
      color: PARAM_COLORS.utm_campaign,
    },
    {
      key: "utm_term",
      value: formData.element,
      explanation: getParamExplanation("utm_term", formData.element, channel),
      color: PARAM_COLORS.utm_term,
    },
  ];

  if (formData.contentId) {
    params.push({
      key: "utm_content",
      value: formData.contentId,
      explanation: getParamExplanation("utm_content", formData.contentId, channel),
      color: PARAM_COLORS.utm_content,
    });
  }

  if (formData.ppSql) {
    params.push({
      key: "pp_sql",
      value: formData.ppSql,
      explanation: getParamExplanation("pp_sql", formData.ppSql, channel),
      color: PARAM_COLORS.pp_sql,
    });
  }

  // Build full URL
  const baseUrl = formData.url.replace(/\/$/, "");
  const separator = baseUrl.includes("?") ? "&" : "?";
  const queryString = params
    .map((p) => `${p.key}=${encodeURIComponent(p.value)}`)
    .join("&");
  const fullUrl = `${baseUrl}${separator}${queryString}`;

  // QA checks
  const qaChecks: QACheck[] = [
    { label: "All lowercase", passed: fullUrl === fullUrl.toLowerCase() },
    { label: "No spaces", passed: !params.some((p) => p.value.includes(" ")) },
    { label: "pp_sql present", passed: !!formData.ppSql },
    { label: "All required fields", passed: true },
  ];

  return {
    fullUrl,
    shortLink: "", // Will be set by N8N in production
    params,
    requiresQR: channel.requiresQR,
    qaChecks,
    ppSql: formData.ppSql,
  };
}

export function UTMBuilderFlow() {
  const [flowState, setFlowState] = useState<UTMFlowState>("url-input");
  const [formData, setFormData] = useState<UTMFormData>(INITIAL_FORM);
  const [result, setResult] = useState<UTMResult | null>(null);

  const handleUrlNext = useCallback((url: string, channel: ChannelOption) => {
    const ppSqlDetection = detectPpSql(url);
    const blogContent = extractBlogContent(url);

    setFormData((prev) => ({
      ...prev,
      url,
      channel,
      ppSql: ppSqlDetection?.ppSql ?? "",
      contentId: blogContent ?? "",
      element: channel.defaultElement,
      emailAudience: channel.utmMedium,
    }));
    setFlowState("campaign-details");
  }, []);

  const handleCampaignBack = useCallback(() => {
    setFlowState("url-input");
  }, []);

  const handleGenerate = useCallback(
    async (data: {
      campaignName: string;
      element: string;
      contentId: string;
      emailAudience: string;
      ppSql: string;
    }) => {
      const updatedForm: UTMFormData = {
        ...formData,
        ...data,
      };
      setFormData(updatedForm);
      setFlowState("loading");

      // TODO: Replace with N8N webhook call
      // For now, build client-side
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network

      const utmResult = buildUTMResult(updatedForm);
      setResult(utmResult);
      setFlowState("results");
    },
    [formData]
  );

  const handleReset = useCallback(() => {
    setFormData(INITIAL_FORM);
    setResult(null);
    setFlowState("url-input");
  }, []);

  return (
    <motion.div
      layout
      className={`bento-card p-8 mx-auto w-full transition-all ${stepWidths[flowState]}`}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
    >
      <AnimatePresence mode="wait">
        {flowState === "url-input" && (
          <motion.div
            key="url-input"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <StepUrlInput
              initialUrl={formData.url}
              initialChannel={formData.channel}
              onNext={handleUrlNext}
            />
          </motion.div>
        )}

        {flowState === "campaign-details" && formData.channel && (
          <motion.div
            key="campaign-details"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <StepCampaignDetails
              url={formData.url}
              channel={formData.channel}
              initialCampaign={formData.campaignName}
              initialElement={formData.element}
              initialContent={formData.contentId}
              initialEmailAudience={formData.emailAudience}
              initialPpSql={formData.ppSql}
              onBack={handleCampaignBack}
              onGenerate={handleGenerate}
            />
          </motion.div>
        )}

        {flowState === "loading" && (
          <motion.div
            key="loading"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Building your UTM...
            </p>
          </motion.div>
        )}

        {flowState === "results" && result && (
          <motion.div
            key="results"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <StepResults result={result} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
