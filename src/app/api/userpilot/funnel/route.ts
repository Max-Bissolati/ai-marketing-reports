import { NextResponse } from "next/server";
import type { PopupFunnelData } from "@/types/reporting-types";

const N8N_BASE = process.env.N8N_WEBHOOK_BASE_URL ?? "https://automations.thingymajigs.app";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignSlug = searchParams.get("campaignSlug");

  if (!campaignSlug) return NextResponse.json(null);

  try {
    const res = await fetch(
      `${N8N_BASE}/webhook/userpilot-funnel-get?campaignSlug=${encodeURIComponent(campaignSlug)}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return NextResponse.json(null);

    const body = await res.json();
    if (!body?.found || !body?.data) return NextResponse.json(null);

    const d = body.data;
    const data: PopupFunnelData = {
      impressions: Number(d.impressions),
      clicks: Number(d.clicks),
      signups: Number(d.signups),
      primaryCta: String(d.primaryCta ?? ""),
      secondaryCta: String(d.secondaryCta ?? ""),
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
