import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  "https://automations.thingymajigs.app/webhook/page-traffic";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname") || "/";
  const days = request.nextUrl.searchParams.get("days") || "90";

  const url = `${N8N_WEBHOOK_URL}?pathname=${encodeURIComponent(pathname)}&days=${days}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.json();

  // N8N Respond node returns array — unwrap
  const payload = Array.isArray(data) ? data[0] : data;

  return NextResponse.json(payload);
}
