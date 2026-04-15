# Reporting Dashboard Restructuring Plan

> **Campaign:** Payouts  
> **Created:** 2026-03-18  
> **Status:** Planning Complete

---

## Overview

This plan outlines the restructuring of the Payouts campaign reporting dashboard to include:
1. **Popup Performance Chart** - Conversion funnel visualization for dashboard popup CTAs
2. **Campaign Website Page Line Graph** - Dedicated time-series chart for landing page metrics
3. **Blog Articles Performance Table** - Article metrics table filtered by campaign category

---

## 1. Component Architecture

### New Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| [`PopupFunnelChart`](../src/components/reporting/popup-funnel-chart.tsx) | `components/reporting/` | Visualizes popup CTA conversion funnel |
| [`CampaignPageChart`](../src/components/reporting/campaign-page-chart.tsx) | `components/reporting/` | Time-series line chart for campaign landing page |
| [`ArticlesTable`](../src/components/reporting/articles-table.tsx) | `components/reporting/` | Blog articles performance table |
| [`reporting-types.ts`](../src/types/reporting-types.ts) | `types/` | Shared TypeScript interfaces |

### Existing Components to Modify

| Component | Changes |
|-----------|---------|
| [`page.tsx`](../src/app/reporting/payouts/page.tsx) | Replace `ChartAreaInteractive` with new components, restructure layout |
| [`metrics-cards.tsx`](../src/components/reporting/metrics-cards.tsx) | Update to accept campaign-specific props (optional enhancement) |

### Components to Keep Unchanged

- [`campaign-charts.tsx`](../src/components/reporting/campaign-charts.tsx) - Lifecycle, Email, LinkedIn, YouTube charts
- [`mql-table.tsx`](../src/components/reporting/mql-table.tsx) - MQL table (reference implementation)
- [`interactive-area-chart.tsx`](../src/components/reporting/interactive-area-chart.tsx) - May be deprecated or repurposed

---

## 2. Data Structures

### TypeScript Interfaces

```typescript
// src/types/reporting-types.ts

/**
 * Popup CTA conversion funnel data
 */
export interface PopupFunnelData {
  /** Total users who saw the popup */
  impressions: number;
  /** Total users who clicked to explore */
  clicks: number;
  /** Total dashboard sign-ups from popup */
  signups: number;
  /** CTA configuration */
  ctas: {
    primary: {
      label: string;
      url: string;
      clicks: number;
    };
    secondary: {
      label: string;
      url: string;
      clicks: number;
    };
  };
}

/**
 * Single data point for campaign page time-series
 */
export interface CampaignPageDataPoint {
  date: string; // ISO date string "YYYY-MM-DD"
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // in seconds
  bounceRate: number; // percentage 0-100
}

/**
 * Blog article performance metrics
 */
export interface ArticlePerformance {
  id: string;
  title: string;
  url: string;
  category: string; // e.g., "payouts"
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // in seconds
  bounceRate: number; // percentage 0-100
  conversions: number;
  publishedDate: string;
}

/**
 * Time range filter option
 */
export type TimeRange = "90d" | "30d" | "7d";

/**
 * Campaign configuration passed to components
 */
export interface CampaignConfig {
  slug: string; // e.g., "payouts"
  name: string; // e.g., "Payouts"
  categoryTag: string; // Blog category tag for article filtering
}
```

### Mock Data

```typescript
// src/components/reporting/popup-funnel-chart.tsx (inline)

const mockPopupData: PopupFunnelData = {
  impressions: 2546,
  clicks: 103,
  signups: 35,
  ctas: {
    primary: {
      label: "Payouts Web Page",
      url: "https://peachpayments.com/payouts",
      clicks: 68,
    },
    secondary: {
      label: "Dev Docs",
      url: "https://developer.peachpayments.com/docs/payouts",
      clicks: 35,
    },
  },
};
```

```typescript
// src/components/reporting/campaign-page-chart.tsx (inline)

const generateCampaignPageData = (): CampaignPageDataPoint[] => {
  const data: CampaignPageDataPoint[] = [];
  const startDate = new Date("2024-04-01");

  for (let i = 0; i <= 90; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    data.push({
      date: currentDate.toISOString().split('T')[0],
      views: Math.floor(150 + Math.sin(i / 12) * 80 + i * 2.5),
      uniqueVisitors: Math.floor(120 + Math.sin(i / 12) * 60 + i * 2),
      avgTimeOnPage: Math.floor(120 + Math.sin(i / 8) * 30),
      bounceRate: Math.floor(35 + Math.sin(i / 10) * 15),
    });
  }
  return data;
};
```

```typescript
// src/components/reporting/articles-table.tsx (inline)

const mockArticlesData: ArticlePerformance[] = [
  {
    id: "1",
    title: "Getting Started with Payouts API",
    url: "/blog/getting-started-payouts-api",
    category: "payouts",
    views: 1245,
    uniqueVisitors: 987,
    avgTimeOnPage: 185,
    bounceRate: 32,
    conversions: 12,
    publishedDate: "2024-02-15",
  },
  {
    id: "2",
    title: "How to Automate Merchant Payouts",
    url: "/blog/automate-merchant-payouts",
    category: "payouts",
    views: 892,
    uniqueVisitors: 734,
    avgTimeOnPage: 210,
    bounceRate: 28,
    conversions: 8,
    publishedDate: "2024-02-28",
  },
  {
    id: "3",
    title: "Payouts vs Competitors: A Comparison",
    url: "/blog/payouts-comparison-guide",
    category: "payouts",
    views: 1567,
    uniqueVisitors: 1203,
    avgTimeOnPage: 245,
    bounceRate: 25,
    conversions: 15,
    publishedDate: "2024-03-05",
  },
  {
    id: "4",
    title: "Understanding Payout Webhooks",
    url: "/blog/payout-webhooks-guide",
    category: "payouts",
    views: 654,
    uniqueVisitors: 521,
    avgTimeOnPage: 165,
    bounceRate: 38,
    conversions: 5,
    publishedDate: "2024-03-12",
  },
  {
    id: "5",
    title: "Best Practices for Batch Payouts",
    url: "/blog/batch-payouts-best-practices",
    category: "payouts",
    views: 789,
    uniqueVisitors: 623,
    avgTimeOnPage: 195,
    bounceRate: 30,
    conversions: 7,
    publishedDate: "2024-03-18",
  },
];
```

---

## 3. Component Hierarchy

### Page Layout Structure

```
PayoutsDashboard (page.tsx)
├── Sticky Header (existing)
├── MetricsCards (existing - row 1)
├── PopupFunnelChart (NEW - row 2, full width)
├── CampaignPageChart (NEW - row 3, col-span-7)
├── CampaignCharts "lifecycle" (existing - row 3, col-span-5)
├── CampaignCharts "email" (existing - row 4, col-span-7)
├── CampaignCharts "linkedin" (existing - row 5, col-span-4)
├── CampaignCharts "youtube" (existing - row 5, col-span-4)
├── Automated Data Sync card (existing - row 5, col-span-4)
└── ArticlesTable (NEW - row 6, full width)
```

### Visual Layout (Grid)

```
┌─────────────────────────────────────────────────────────────┐
│                    Sticky Header                            │
├─────────────────────────────────────────────────────────────┤
│  [Metric 1]  │  [Metric 2]  │  [Metric 3]  │  [Metric 4]   │  Row 1
├─────────────────────────────────────────────────────────────┤
│                   PopupFunnelChart                          │  Row 2
│              (Conversion Funnel Visualization)              │
├─────────────────────────────────────────────────────────────┤
│                     CampaignPageChart                       │  Row 3
│              (Landing Page Time-Series)                     │
├───────────────────────┬─────────────────────────────────────┤
│  CampaignPageChart    │     Lifecycle Stages Chart          │  Row 4
│  (col-span-7)         │     (col-span-5)                    │
├───────────────────────┴─────────────────────────────────────┤
│              Email Workflow Performance                     │  Row 5
├─────────────────┬─────────────────┬─────────────────────────┤
│ LinkedIn        │ YouTube         │ Automated Data Sync     │  Row 6
├─────────────────┴─────────────────┴─────────────────────────┤
│                    ArticlesTable                            │  Row 7
│              (Blog Articles Performance)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 PopupFunnelChart

**Purpose:** Visualize the popup CTA conversion funnel from impressions → clicks → signups

**Design Options:**
- **Option A (Recommended):** Horizontal funnel with percentage drops between stages
- **Option B:** Sankey-style flow diagram showing CTA split
- **Option C:** Vertical conversion metrics cards with connecting arrows

**Recommended Implementation:** Horizontal funnel with:
- Three stages: Impressions → Clicks → Signups
- Percentage conversion between each stage
- CTA breakdown showing Primary vs Secondary clicks

**Props:**
```typescript
interface PopupFunnelChartProps {
  data: PopupFunnelData;
  className?: string;
}
```

**Styling:**
- Use `bento-card` class for container
- Primary color (#FF6600) for funnel bars
- Glass effect with backdrop blur
- Framer Motion entrance animation

**Example Structure:**
```tsx
<Card className="bento-card border-0 shadow-none">
  <CardHeader>
    <CardTitle>Popup Performance</CardTitle>
    <CardDescription>Dashboard notification conversion funnel</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Funnel visualization */}
    {/* CTA breakdown */}
  </CardContent>
</Card>
```

---

### 4.2 CampaignPageChart

**Purpose:** Time-series visualization of campaign landing page metrics

**Features:**
- Line/area chart with multiple metrics
- Time range selector (90d, 30d, 7d) - same as existing interactive-area-chart
- Metric toggle to show/hide different lines
- Tooltip with detailed metrics on hover

**Props:**
```typescript
interface CampaignPageChartProps {
  data: CampaignPageDataPoint[];
  campaignName: string;
  className?: string;
}
```

**Chart Configuration:**
```typescript
const chartConfig = {
  views: {
    label: "Page Views",
    color: "var(--primary)",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;
```

**Styling:**
- Same pattern as existing `ChartAreaInteractive`
- Use gradient fills under lines
- Glass card container

---

### 4.3 ArticlesTable

**Purpose:** Display performance metrics for blog articles related to the campaign

**Features:**
- Sortable columns
- Click-through to article URL
- Formatted time display (mm:ss)
- Percentage formatting for bounce rate
- Badge for high-converting articles

**Props:**
```typescript
interface ArticlesTableProps {
  data: ArticlePerformance[];
  categoryTag: string;
  className?: string;
}
```

**Columns:**
| Column | Type | Format |
|--------|------|--------|
| Article Title | Link | Clickable, opens in new tab |
| Views | Number | Comma-separated (1,234) |
| Unique Visitors | Number | Comma-separated |
| Avg Time on Page | Time | mm:ss format |
| Bounce Rate | Percentage | 32% |
| Conversions | Number | Badge if high |

**Styling:**
- Same pattern as existing `MqlTable`
- `bento-card` container
- Hover states on rows
- Badge for high-performing articles

---

## 5. Implementation Order

### Phase 1: Foundation (Types & Mock Data)
1. Create [`src/types/reporting-types.ts`](../src/types/reporting-types.ts) with all interfaces
2. Verify imports work correctly

### Phase 2: Popup Funnel Chart
1. Create [`src/components/reporting/popup-funnel-chart.tsx`](../src/components/reporting/popup-funnel-chart.tsx)
2. Implement horizontal funnel visualization
3. Add CTA breakdown section
4. Add Framer Motion animations
5. Test in isolation

### Phase 3: Campaign Page Chart
1. Create [`src/components/reporting/campaign-page-chart.tsx`](../src/components/reporting/campaign-page-chart.tsx)
2. Adapt time range selector from existing chart
3. Implement multi-line area chart
4. Add tooltip with all metrics
5. Test in isolation

### Phase 4: Articles Table
1. Create [`src/components/reporting/articles-table.tsx`](../src/components/reporting/articles-table.tsx)
2. Follow MqlTable pattern for structure
3. Implement sortable columns (optional enhancement)
4. Add time formatting utility
5. Test in isolation

### Phase 5: Page Integration
1. Update [`src/app/reporting/payouts/page.tsx`](../src/app/reporting/payouts/page.tsx)
2. Import new components
3. Restructure grid layout
4. Remove or repurpose `ChartAreaInteractive`
5. Test full page rendering

### Phase 6: Polish & Testing
1. Verify all animations work correctly
2. Test responsive behavior (mobile, tablet, desktop)
3. Check glass effects consistency
4. Verify time range filtering works
5. Cross-browser testing

---

## 6. File Structure

### New Files

```
ai-marketing-ui/
├── src/
│   ├── types/
│   │   └── reporting-types.ts          # NEW: TypeScript interfaces
│   └── components/
│       └── reporting/
│           ├── popup-funnel-chart.tsx   # NEW: Popup conversion funnel
│           ├── campaign-page-chart.tsx  # NEW: Landing page time-series
│           └── articles-table.tsx       # NEW: Blog articles table
└── docs/
    └── PLAN.md                          # This file
```

### Modified Files

```
ai-marketing-ui/
└── src/
    └── app/
        └── reporting/
            └── payouts/
                └── page.tsx             # MODIFY: Restructure layout
```

### Potentially Deprecated

```
ai-marketing-ui/
└── src/
    └── components/
        └── reporting/
            └── interactive-area-chart.tsx  # May be replaced by campaign-page-chart.tsx
```

---

## 7. Reusability Considerations

### Making Components Campaign-Agnostic

All new components should accept configuration props to work across campaigns:

```typescript
// Example: CampaignPageChart with campaign config
<CampaignPageChart 
  data={payoutsPageData}
  campaignName="Payouts"
/>

// Example: ArticlesTable with category filter
<ArticlesTable 
  data={allArticles}
  categoryTag="payouts"  // Filters to relevant articles
/>
```

### Future Campaign Template

The page structure should be extractable into a template:

```typescript
// Future: src/app/reporting/[campaign]/page.tsx
export default function CampaignDashboard({ params }: { params: { campaign: string } }) {
  const config = getCampaignConfig(params.campaign);
  // Render with campaign-specific data
}
```

---

## 8. Technical Notes

### Chart Library
- Continue using **Recharts** (already in project)
- Use `AreaChart` for time-series
- Use custom SVG or CSS for funnel visualization

### Styling Consistency
- All cards use `bento-card` class
- Primary color: `var(--primary)` (#FF6600)
- Secondary chart color: `var(--chart-5)`
- Glass effect: `bg-white/[0.04] backdrop-blur-[12px]`

### Animation Pattern
```typescript
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};
```

### Time Formatting Utility
```typescript
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

---

## 9. Future Enhancements (Out of Scope)

- [ ] Real Rybbit analytics integration
- [ ] Date range picker (custom range)
- [ ] Export functionality for tables
- [ ] Real-time data updates (WebSocket)
- [ ] Comparison mode (vs previous period)
- [ ] Drill-down into article details
- [ ] A/B test results integration

---

## 10. Acceptance Criteria

- [ ] PopupFunnelChart displays conversion funnel with correct percentages
- [ ] CampaignPageChart shows time-series with working time range selector
- [ ] ArticlesTable displays all columns with proper formatting
- [ ] All components use consistent glass styling
- [ ] Page layout matches the grid structure defined above
- [ ] Components are reusable for other campaigns
- [ ] Framer Motion animations work on all new components
- [ ] Responsive design works on mobile, tablet, and desktop

---

*Last updated: 2026-03-18*
