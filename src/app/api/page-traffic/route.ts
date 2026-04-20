import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK = "https://automations.thingymajigs.app/webhook/page-traffic";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname") || "/";
  const days     = request.nextUrl.searchParams.get("days") || "90";
  const siteId   = request.nextUrl.searchParams.get("siteId") || "1";

  const revalidate = siteId === "1" ? 300 : 1800;

  const url = `${N8N_WEBHOOK}?pathname=${encodeURIComponent(pathname)}&days=${days}&siteId=${siteId}`;
  const res = await fetch(url, { next: { revalidate } });
  const data = await res.json();
  const payload = Array.isArray(data) ? data[0] : data;

  return NextResponse.json(payload);
}
