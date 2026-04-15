export interface PopupFunnelData {
    impressions: number;       // Users who saw popup: 2546
    clicks: number;            // Users who clicked: 103
    signups: number;           // Dashboard sign-ups: 35
    primaryCta: string;        // "Payouts Web page"
    secondaryCta: string;      // "Dev docs page"
}

export interface CampaignPageDataPoint {
    date: string;
    views: number;
    clicks: number;
    conversions: number;
}

export interface ArticlePerformance {
    id: string;
    title: string;
    url: string;
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;     // in seconds
    bounceRate: number;        // percentage 0-100
    conversions: number;
}

export interface CampaignConfig {
    campaignSlug: string;      // e.g., "payouts"
    campaignName: string;      // e.g., "Payouts 2026"
}

// Live data from N8N Campaign Dashboard workflow
export interface CampaignDashboardData {
    campaign: string;
    generatedAt: string;
    totalBeforeFilter: number;
    kpis: {
        totalContacts: number;
        marketingAssisted: number;
        totalTouches: number;
        avgTouchesPerContact: number;
    };
    lifecycleStages: { stage: string; count: number }[];
    channels: { source: string; medium: string; count: number }[];
    contacts: CampaignContact[];
}

// Landing page data aggregated from Sink links
export interface LandingPageData {
    url: string;
    label: string;
    totalLinks: number;
    sources: { source: string; medium: string; count: number }[];
}

export interface CampaignContact {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    lifecyclestage: string;
    utmSource: string;
    utmMedium: string;
    marketingAssisted: string;
    touchCount: number;
    firstTouchCampaign: string;
    hubspotUrl: string;
}
