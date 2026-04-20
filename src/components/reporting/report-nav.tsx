"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, LayoutDashboard, ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { REPORTS } from "@/config/reports";

export function ReportNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const currentSlug = REPORTS.find(
    (r) => pathname === r.slug || pathname === r.internalPath
  )?.slug;

  return (
    <>
      {/* Hamburger — hidden while sheet is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-5 left-5 z-[60] h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center cursor-pointer"
          aria-label="Open reports menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        {/* Transparent outer shell with padding so the card floats away from all edges */}
        <SheetContent
          side="left"
          showCloseButton={true}
          className="!top-4 !bottom-4 !left-4 !h-[calc(100dvh-2rem)] !w-[300px] bg-transparent border-none shadow-none p-0"
        >
          {/* Glass card */}
          <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-[#0b0f4a] border border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">

            <SheetHeader className="px-5 pt-6 pb-5 border-b border-white/[0.07] shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,102,0,0.2)]">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-sm font-semibold text-foreground">
                    Campaign Reports
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {REPORTS.length} reports available
                  </p>
                </div>
              </div>
            </SheetHeader>

            <nav className="px-3 py-3 flex flex-col gap-1 flex-1 overflow-y-auto">
              {REPORTS.map((report) => {
                const isActive = report.slug === currentSlug;
                return (
                  <Link
                    key={report.slug}
                    href={report.slug}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all ${
                      isActive
                        ? "bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(255,102,0,0.08),inset_0_1px_0_rgba(255,102,0,0.1)]"
                        : "hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground/90"}`}>
                        {report.label}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {report.description}
                      </p>
                    </div>
                    {isActive ? (
                      <span className="shrink-0 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                        Viewing
                      </span>
                    ) : (
                      <ArrowUpRight className="shrink-0 h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">
              <p className="text-[11px] text-muted-foreground/40 text-center">
                Peach Payments · Reporting Engine
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
