import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import type { WWXPageTrafficData } from "@/types/reporting-types";

const N8N_WEBHOOK = "https://automations.thingymajigs.app/webhook/wwx-page-traffic";

const fetchPageTraffic = unstable_cache(
  async (): Promise<WWXPageTrafficData> => {
    const res = await fetch(N8N_WEBHOOK, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`N8N webhook error: ${res.status}`);
    return res.json();
  },
  ["wwx-page-traffic"],
  { revalidate: 1800 }
);

export async function GET() {
  try {
    const data = await fetchPageTraffic();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[wwx-page-traffic]", err);
    return NextResponse.json({ error: "Failed to fetch GA4 traffic data" }, { status: 500 });
  }
}
