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
  SheetTrigger,
} from "@/components/ui/sheet";
import { REPORTS } from "@/config/reports";

export function ReportNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Match against both public slug and internal path (rewrites keep public URL in browser)
  const currentSlug = REPORTS.find(
    (r) => pathname === r.slug || pathname === r.internalPath
  )?.slug;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="fixed top-5 left-5 z-[60] h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center cursor-pointer"
        aria-label="Open reports menu"
      >
        <Menu className="h-4 w-4" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[320px] bg-[#070a43]/90 backdrop-blur-[20px] border-r border-white/10 shadow-[4px_0_40px_rgba(0,0,0,0.5)] rounded-r-3xl p-0"
      >
        <SheetHeader className="px-6 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
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

        <nav className="px-4 py-4 flex flex-col gap-1">
          {REPORTS.map((report) => {
            const isActive = report.slug === currentSlug;
            return (
              <Link
                key={report.slug}
                href={report.slug}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all ${
                  isActive
                    ? "bg-primary/15 border border-primary/25 shadow-[0_0_15px_rgba(255,102,0,0.1)]"
                    : "hover:bg-white/5 border border-transparent hover:border-white/10"
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {report.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {report.description}
                  </p>
                </div>
                {isActive ? (
                  <span className="shrink-0 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                    Viewing
                  </span>
                ) : (
                  <ArrowUpRight className="shrink-0 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <p className="text-[11px] text-muted-foreground/50 text-center">
            Peach Payments · Reporting Engine
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
