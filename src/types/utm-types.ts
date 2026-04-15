// UTM Builder Skill — Type Definitions

export type ChannelCategory =
  | "social"
  | "email"
  | "print"
  | "paid"
  | "website"
  | "events"
  | "other";

export interface ChannelOption {
  id: string;
  label: string;
  category: ChannelCategory;
  utmSource: string;
  utmMedium: string;
  icon: string; // Lucide icon name
  requiresQR: boolean;
  defaultElement: string;
  elements: string[];
}

export interface UTMFormData {
  url: string;
  channel: ChannelOption | null;
  campaignName: string;
  element: string;
  contentId: string;
  emailAudience: string;
  ppSql: string;
}

export interface UTMParamResult {
  key: string;
  value: string;
  explanation: string;
  color: string;
}

export interface QACheck {
  label: string;
  passed: boolean;
}

export interface UTMResult {
  fullUrl: string;
  shortLink: string;
  params: UTMParamResult[];
  requiresQR: boolean;
  qaChecks: QACheck[];
  ppSql: string;
}

export type UTMFlowState =
  | "url-input"
  | "campaign-details"
  | "review"
  | "loading"
  | "results";
