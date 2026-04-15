import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  "https://automations.thingymajigs.app/webhook/campaign-dashboard";

export async function GET(request: NextRequest) {
  const campaign = request.nextUrl.searchParams.get("campaign") || "travel";
  const excludeInternal =
    request.nextUrl.searchParams.get("excludeInternal") ?? "true";

  const url = `${N8N_WEBHOOK_URL}?campaign=${encodeURIComponent(campaign)}&excludeInternal=${excludeInternal}`;

  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
  const data = await res.json();

  const payload = Array.isArray(data) ? data[0] : data;

  return NextResponse.json(payload);
}
