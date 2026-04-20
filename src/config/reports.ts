export interface ReportLink {
  slug: string;         // public-facing URL (e.g. /travel-campaign-2026)
  internalPath: string; // Next.js internal route (e.g. /reporting/travel-2026)
  label: string;
  description: string;
  year: number;
}

// Add a new entry here whenever a new campaign report is created.
export const REPORTS: ReportLink[] = [
  {
    slug: "/travel-campaign-2026",
    internalPath: "/reporting/travel-2026",
    label: "Future of Travel Payments",
    description: "South Africa · 2026",
    year: 2026,
  },
  {
    slug: "/online-retail-report-2025",
    internalPath: "/reporting/wwx-2025",
    label: "Online Retail Report",
    description: "World Wide Worx · 2025",
    year: 2025,
  },
  {
    slug: "/payouts-campaign-2026",
    internalPath: "/reporting/payouts",
    label: "Payouts Campaign",
    description: "Peach Payments · 2026",
    year: 2026,
  },
];
