"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { PARAM_COLORS } from "@/lib/utm-constants";

interface UTMUrlDisplayProps {
  fullUrl: string;
  shortLink: string;
}

function ColoredUrl({ url }: { url: string }) {
  try {
    const parsed = new URL(url);
    const base = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
    const params = parsed.searchParams;
    const entries = Array.from(params.entries());

    return (
      <span className="break-all">
        <span className="text-foreground/70">{base}</span>
        {entries.length > 0 && (
          <span className="text-foreground/30">?</span>
        )}
        {entries.map(([key, value], i) => (
          <span key={key}>
            {i > 0 && <span className="text-foreground/30">&</span>}
            <span className="text-muted-foreground">{key}=</span>
            <span
              className="font-semibold"
              style={{ color: PARAM_COLORS[key] ?? "#F8F8F8" }}
            >
              {value}
            </span>
          </span>
        ))}
      </span>
    );
  } catch {
    return <span className="text-foreground">{url}</span>;
  }
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-foreground/80 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          {label}
        </>
      )}
    </button>
  );
}

export function UTMUrlDisplay({ fullUrl, shortLink }: UTMUrlDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="space-y-4"
    >
      {/* Full URL */}
      <div className="bento-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Full URL
          </span>
          <CopyButton text={fullUrl} label="Copy" />
        </div>
        <div className="font-mono text-sm leading-relaxed p-3 rounded-xl bg-black/30 border border-white/5">
          <ColoredUrl url={fullUrl} />
        </div>
      </div>

      {/* Short Link */}
      {shortLink && (
        <div className="bento-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Short Link
            </span>
            <div className="flex items-center gap-2">
              <a
                href={shortLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-foreground/80 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                Test
              </a>
              <CopyButton text={shortLink} label="Copy" />
            </div>
          </div>
          <div className="font-mono text-lg font-semibold text-primary">
            {shortLink}
          </div>
        </div>
      )}
    </motion.div>
  );
}
