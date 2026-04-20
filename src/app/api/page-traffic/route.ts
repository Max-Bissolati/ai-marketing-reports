import { NextRequest, NextResponse } from "next/server";

const N8N_PAGE_TRAFFIC = "https://automations.thingymajigs.app/webhook/page-traffic";
const N8N_WWX_TRAFFIC  = "https://automations.thingymajigs.app/webhook/wwx-page-traffic";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname") || "/";
  const days     = request.nextUrl.searchParams.get("days") || "90";
  const siteId   = request.nextUrl.searchParams.get("siteId");

  // Site 2 = reports.peachpayments.com — served by the wwx-page-traffic N8N workflow
  if (siteId === "2") {
    const res = await fetch(N8N_WWX_TRAFFIC, { next: { revalidate: 1800 } });
    if (!res.ok) return NextResponse.json({ dataPoints: [] }, { status: 200 });

    const wwx = await res.json();
    return NextResponse.json({
      pathname,
      totalViews: wwx.totals?.pageViews ?? 0,
      totalSessions: wwx.totals?.sessions ?? 0,
      dataPoints: (wwx.daily ?? []).map((d: { date: string; pageViews: number; sessions: number }) => ({
        date: d.date,
        views: d.pageViews,
        sessions: d.sessions,
      })),
    });
  }

  // Default: site 1 (peachpayments.com) via the existing N8N workflow
  const url = `${N8N_PAGE_TRAFFIC}?pathname=${encodeURIComponent(pathname)}&days=${days}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.json();
  const payload = Array.isArray(data) ? data[0] : data;
  return NextResponse.json(payload);
}
