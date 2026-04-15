"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Image } from "lucide-react";

interface QRCodeCardProps {
  shortLink: string;
}

export function QRCodeCard({ shortLink }: QRCodeCardProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const downloadSVG = useCallback(() => {
    const svgEl = svgContainerRef.current?.querySelector("svg");
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "peach-qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadPNG = useCallback(() => {
    const svgEl = svgContainerRef.current?.querySelector("svg");
    if (!svgEl) return;

    const scale = 4;
    const size = 200 * scale;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // White background for PNG
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "peach-qr-code.png";
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");

      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="bento-card p-6 flex flex-col items-center gap-5"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          QR Code
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
          Print Ready
        </span>
      </div>

      {/* QR Code */}
      <div
        ref={svgContainerRef}
        className="p-4 rounded-2xl bg-white"
      >
        <QRCodeSVG
          value={shortLink}
          size={200}
          bgColor="#FFFFFF"
          fgColor="#FF6600"
          level="M"
          includeMargin={false}
        />
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Encodes the short link for clean scanning. Redirects to the full UTM URL.
      </p>

      {/* Download Buttons */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={downloadSVG}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          SVG
        </button>
        <button
          onClick={downloadPNG}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
        >
          <Image className="w-4 h-4" />
          PNG
        </button>
      </div>
    </motion.div>
  );
}
