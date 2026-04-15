import { NextRequest, NextResponse } from "next/server";
import type { LandingPageData } from "@/types/reporting-types";

const SINK_API_URL = process.env.SINK_API_URL || "https://ppay.click";
const SINK_API_TOKEN = process.env.SINK_API_TOKEN || "";

interface SinkLink {
  slug: string;
  url: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
}

/** Fetch all Sink links with pagination */
async function fetchAllSinkLinks(): Promise<SinkLink[]> {
  const allLinks: SinkLink[] = [];
  let cursor: string | undefined;
  let complete = false;

  while (!complete) {
    const url = `${SINK_API_URL}/api/link/export${cursor ? `?cursor=${cursor}` : ""}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${SINK_API_TOKEN}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`Sink API error: ${res.status}`);
    const data = await res.json();

    allLinks.push(...data.links);
    cursor = data.cursor;
    complete = data.list_complete;
  }

  return allLinks;
}

/** Extract a readable label from a URL path */
function urlToLabel(url: string): string {
  try {
    const { pathname, hash } = new URL(url);
    const clean = pathname.replace(/\/$/, "").split("/").pop() || "Home";
    const label = clean
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return hash ? `${label} ${hash}` : label;
  } catch {
    return url;
  }
}

const SOURCE_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  email: "Email",
  main_website: "Website",
  table_talker: "QR Code",
  press_release: "Press",
  blog: "Blog",
  facebook: "Facebook",
  instagram: "Instagram",
  poster: "Poster",
  flyer: "Flyer",
};

export async function GET(request: NextRequest) {
  const campaign = request.nextUrl.searchParams.get("campaign") || "";

  if (!SINK_API_TOKEN) {
    return NextResponse.json({ error: "Sink API token not configured" }, { status: 500 });
  }

  const allLinks = await fetchAllSinkLinks();

  // Filter links by campaign (case-insensitive partial match)
  const campaignLinks = allLinks.filter(
    (link) =>
      link.utmCampaign &&
      link.utmCampaign.toLowerCase().includes(campaign.toLowerCase())
  );

  // Group by destination URL (normalize by stripping trailing slash and hash)
  const byUrl = new Map<string, SinkLink[]>();
  for (const link of campaignLinks) {
    const normalizedUrl = link.url.replace(/#.*$/, "").replace(/\/$/, "");
    const existing = byUrl.get(normalizedUrl) || [];
    existing.push(link);
    byUrl.set(normalizedUrl, existing);
  }

  // Build landing page data
  const landingPages: LandingPageData[] = Array.from(byUrl.entries())
    .map(([url, links]) => {
      // Count by source/medium
      const sourceMap = new Map<string, number>();
      for (const link of links) {
        const key = `${link.utmSource || "unknown"}|${link.utmMedium || "unknown"}`;
        sourceMap.set(key, (sourceMap.get(key) || 0) + 1);
      }

      const sources = Array.from(sourceMap.entries())
        .map(([key, count]) => {
          const [source, medium] = key.split("|");
          return { source, medium, count };
        })
        .sort((a, b) => b.count - a.count);

      return {
        url,
        label: urlToLabel(url),
        totalLinks: links.length,
        sources,
      };
    })
    .sort((a, b) => b.totalLinks - a.totalLinks);

  return NextResponse.json({
    campaign,
    totalLinks: campaignLinks.length,
    landingPages,
    sourceLabels: SOURCE_LABELS,
  });
}
