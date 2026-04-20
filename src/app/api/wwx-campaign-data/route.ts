import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import type { CampaignContact } from "@/types/reporting-types";

const HUBSPOT_PAT = process.env.HUBSPOT_PAT!;
const PORTAL_ID   = "7856266";

const FORMS = {
  mainDownload: { id: "57c8a721-4a2e-43fb-a085-b79889506520", name: "Report Download Form" },
  blogVersion:  { id: "4915f7a4-b5c1-4c1e-84b9-26cd717dca74", name: "Blog Version" },
  rsvp:         { id: "4e6e9326-9209-4bf9-8939-3de9fa7ffda0", name: "RSVP Form" },
} as const;

// ─── Form submissions ──────────────────────────────────────────────────────────

async function fetchAllSubmissions(formId: string) {
  const results: Record<string, unknown>[] = [];
  let after: string | undefined;
  while (true) {
    const url = `https://api.hubapi.com/form-integrations/v1/submissions/forms/${formId}${after ? `?after=${after}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${HUBSPOT_PAT}` } });
    if (!res.ok) break;
    const data = await res.json();
    results.push(...(data.results ?? []));
    after = data.paging?.next?.after;
    if (!after) break;
  }
  return results;
}

function extractVals(s: Record<string, unknown>): Record<string, string> {
  const vals: Record<string, string> = {};
  for (const v of (s.values as { name: string; value: string }[]) ?? []) {
    vals[v.name] = v.value;
  }
  return vals;
}

function buildMonthly(subs: Record<string, unknown>[]) {
  const months: Record<string, number> = {};
  for (const s of subs) {
    const d = new Date(s.submittedAt as number);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = (months[key] ?? 0) + 1;
  }
  return Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// ─── HubSpot contact batch read ────────────────────────────────────────────────

interface HsContactData {
  id: string;
  lifecyclestage: string;
  firstname: string;
  lastname: string;
  company: string;
  analyticsSource: string;
  analyticsSourceData1: string;
}

async function batchReadContacts(emails: string[]): Promise<Map<string, HsContactData>> {
  const result = new Map<string, HsContactData>();
  const batchSize = 100;

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/read", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUBSPOT_PAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idProperty: "email",
        properties: [
          "firstname", "lastname", "email", "company", "lifecyclestage",
          "hs_analytics_source", "hs_analytics_source_data_1",
        ],
        inputs: batch.map((email) => ({ id: email })),
      }),
    });
    if (!res.ok) continue;
    const data = await res.json();
    for (const contact of data.results ?? []) {
      const email = (contact.properties?.email ?? "").toLowerCase().trim();
      if (email) {
        result.set(email, {
          id:                   contact.id,
          lifecyclestage:       contact.properties?.lifecyclestage        ?? "",
          firstname:            contact.properties?.firstname             ?? "",
          lastname:             contact.properties?.lastname              ?? "",
          company:              contact.properties?.company               ?? "",
          analyticsSource:      contact.properties?.hs_analytics_source   ?? "",
          analyticsSourceData1: contact.properties?.hs_analytics_source_data_1 ?? "",
        });
      }
    }
  }

  return result;
}

// Map HubSpot hs_analytics_source → {source, medium} for ChannelChart
function hsSourceToChannel(src: string, data1: string): { source: string; medium: string } {
  const s = src.toUpperCase();
  if (s === "ORGANIC_SEARCH")  return { source: "organic_search",  medium: "organic" };
  if (s === "PAID_SEARCH")     return { source: "paid_search",      medium: "cpc"     };
  if (s === "EMAIL_MARKETING") return { source: "email",            medium: "email"   };
  if (s === "REFERRALS")       return { source: "referral",         medium: "referral"};
  if (s === "DIRECT_TRAFFIC")  return { source: "direct",           medium: "(none)"  };
  if (s === "OTHER_CAMPAIGNS") return { source: "other_campaigns",  medium: "campaign"};
  if (s === "OFFLINE")         return { source: "offline",          medium: "offline" };
  if (s === "SOCIAL_MEDIA") {
    const d = (data1 || "").toLowerCase();
    if (d.includes("linkedin")) return { source: "linkedin",  medium: "social" };
    if (d.includes("facebook")) return { source: "facebook",  medium: "social" };
    if (d.includes("twitter") || d.includes("t.co")) return { source: "twitter", medium: "social" };
    if (d.includes("instagram")) return { source: "instagram", medium: "social" };
    return { source: "social", medium: "social" };
  }
  return { source: src.toLowerCase() || "unknown", medium: "unknown" };
}

// ─── Main cached fetch ─────────────────────────────────────────────────────────

const getCampaignData = unstable_cache(
  async () => {
    const [mainSubs, blogSubs, rsvpSubs] = await Promise.all([
      fetchAllSubmissions(FORMS.mainDownload.id),
      fetchAllSubmissions(FORMS.blogVersion.id),
      fetchAllSubmissions(FORMS.rsvp.id),
    ]);

    const allSubs = [...mainSubs, ...blogSubs, ...rsvpSubs];

    // Build email → {touchCount, earliest submittedAt, form vals} map across all 3 forms
    const emailMap = new Map<string, {
      count: number;
      submittedAt: string;
      vals: Record<string, string>;
    }>();

    for (const subs of [mainSubs, blogSubs, rsvpSubs]) {
      for (const s of subs) {
        const vals = extractVals(s);
        const email = (vals.email ?? "").toLowerCase().trim();
        if (!email) continue;
        const existing = emailMap.get(email);
        if (existing) {
          existing.count++;
        } else {
          emailMap.set(email, {
            count: 1,
            submittedAt: new Date(s.submittedAt as number).toISOString(),
            vals,
          });
        }
      }
    }

    // Enrich with HubSpot lifecycle stage via batch read
    const allEmails = Array.from(emailMap.keys());
    const contactMap = await batchReadContacts(allEmails);

    // Build contacts + aggregate channel data in one pass
    const channelMap = new Map<string, { source: string; medium: string; count: number }>();

    const contacts: CampaignContact[] = Array.from(emailMap.entries()).map(([email, sub]) => {
      const hs = contactMap.get(email);

      // Aggregate channel from hs_analytics_source
      if (hs?.analyticsSource) {
        const ch = hsSourceToChannel(hs.analyticsSource, hs.analyticsSourceData1);
        const key = `${ch.source}|${ch.medium}`;
        const existing = channelMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          channelMap.set(key, { ...ch, count: 1 });
        }
      }

      return {
        id:                 hs?.id ?? email,
        email,
        firstname:          hs?.firstname  || sub.vals.firstname  || "",
        lastname:           hs?.lastname   || sub.vals.lastname   || "",
        company:            hs?.company    || sub.vals.company    || "",
        lifecyclestage:     hs?.lifecyclestage ?? "",
        utmSource:          hs?.analyticsSource ?? "",
        utmMedium:          hs ? hsSourceToChannel(hs.analyticsSource, hs.analyticsSourceData1).medium : "",
        marketingAssisted:  "no",
        touchCount:         sub.count,
        firstTouchCampaign: "World Wide Worx | 2025",
        hubspotUrl:         hs?.id
          ? `https://app.hubspot.com/contacts/${PORTAL_ID}/contact/${hs.id}`
          : "",
      };
    });

    const channels = Array.from(channelMap.values())
      .sort((a, b) => b.count - a.count);

    // Keep recentSubmitters for backward compat (legacy backup page)
    const recentSubmitters = mainSubs.slice(0, 100).map((s) => {
      const vals = extractVals(s);
      return {
        email:       vals.email     ?? "",
        firstname:   vals.firstname ?? "",
        lastname:    vals.lastname  ?? "",
        company:     vals.company   ?? "",
        submittedAt: new Date(s.submittedAt as number).toISOString(),
        pageUrl:     (s.pageUrl as string) ?? "",
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      forms: {
        mainDownload: { name: FORMS.mainDownload.name, submissions: mainSubs.length, monthly: buildMonthly(mainSubs) },
        blogVersion:  { name: FORMS.blogVersion.name,  submissions: blogSubs.length, monthly: buildMonthly(blogSubs) },
        rsvp:         { name: FORMS.rsvp.name,         submissions: rsvpSubs.length, monthly: buildMonthly(rsvpSubs) },
        total: allSubs.length,
      },
      submissionsMonthly: buildMonthly(allSubs),
      recentSubmitters,
      contacts,
      channels,
    };
  },
  ["wwx-campaign-data-v3"],
  { revalidate: 1800 }
);

export async function GET() {
  const data = await getCampaignData();
  return NextResponse.json(data);
}
