import { NextResponse } from "next/server";

const N8N_BASE = process.env.N8N_WEBHOOK_BASE_URL ?? "https://automations.thingymajigs.app";

function parseInput(raw: string): string | null {
  const input = raw.trim();

  // Plain numeric flow ID e.g. "126"
  if (/^\d+$/.test(input)) return input;

  // Extract base64 from permalink formats:
  //   ?userpilot=ZXhw...   or   userpilot=ZXhw...   or   ZXhw... (raw base64)
  let b64 = input;
  const match = input.match(/userpilot=([A-Za-z0-9+/=_-]+)/);
  if (match) b64 = match[1];

  try {
    const decoded = Buffer.from(b64, "base64").toString("utf-8");
    if (decoded.startsWith("experience:")) {
      return decoded.replace("experience:", "").trim();
    }
  } catch {
    // not valid base64
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignSlug, input, primaryCta, secondaryCta, campaignName } = body;

    if (!campaignSlug || !input) {
      return NextResponse.json(
        { success: false, error: "campaignSlug and input are required" },
        { status: 400 }
      );
    }

    const key = parseInput(input);
    if (!key) {
      return NextResponse.json(
        { success: false, error: "Could not parse a flow ID or experience ID from the input" },
        { status: 400 }
      );
    }

    const res = await fetch(`${N8N_BASE}/webhook/userpilot-register-flow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignSlug, key, campaignName, primaryCta, secondaryCta }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "N8N registration failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, key });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
