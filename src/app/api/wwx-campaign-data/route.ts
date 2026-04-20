import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const HUBSPOT_PAT = process.env.HUBSPOT_PAT!;

const FORMS = {
  mainDownload: {
    id: "57c8a721-4a2e-43fb-a085-b79889506520",
    name: "Report Download Form",
  },
  blogVersion: {
    id: "4915f7a4-b5c1-4c1e-84b9-26cd717dca74",
    name: "Blog Version",
  },
  rsvp: {
    id: "4e6e9326-9209-4bf9-8939-3de9fa7ffda0",
    name: "RSVP Form",
  },
} as const;

async function fetchAllSubmissions(formId: string) {
  const results: Record<string, unknown>[] = [];
  let after: string | undefined;

  while (true) {
    const url = `https://api.hubapi.com/form-integrations/v1/submissions/forms/${formId}${after ? `?after=${after}` : ""}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${HUBSPOT_PAT}` },
    });
    if (!res.ok) break;
    const data = await res.json();
    results.push(...(data.results ?? []));
    after = data.paging?.next?.after;
    if (!after) break;
  }

  return results;
}

function buildMonthly(subs: Record<string, unknown>[]) {
  const months: Record<string, number> = {};
  for (const s of subs) {
    const ts = s.submittedAt as number;
    const d = new Date(ts);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = (months[key] ?? 0) + 1;
  }
  return Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

const getCampaignData = unstable_cache(
  async () => {
    const [mainSubs, blogSubs, rsvpSubs] = await Promise.all([
      fetchAllSubmissions(FORMS.mainDownload.id),
      fetchAllSubmissions(FORMS.blogVersion.id),
      fetchAllSubmissions(FORMS.rsvp.id),
    ]);

    const allSubs = [...mainSubs, ...blogSubs, ...rsvpSubs];

    const recentSubmitters = mainSubs.slice(0, 100).map((s) => {
      const vals: Record<string, string> = {};
      for (const v of (s.values as { name: string; value: string }[]) ?? []) {
        vals[v.name] = v.value;
      }
      return {
        email: vals.email ?? "",
        firstname: vals.firstname ?? "",
        lastname: vals.lastname ?? "",
        company: vals.company ?? "",
        submittedAt: new Date(s.submittedAt as number).toISOString(),
        pageUrl: (s.pageUrl as string) ?? "",
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      forms: {
        mainDownload: {
          name: FORMS.mainDownload.name,
          submissions: mainSubs.length,
          monthly: buildMonthly(mainSubs),
        },
        blogVersion: {
          name: FORMS.blogVersion.name,
          submissions: blogSubs.length,
          monthly: buildMonthly(blogSubs),
        },
        rsvp: {
          name: FORMS.rsvp.name,
          submissions: rsvpSubs.length,
          monthly: buildMonthly(rsvpSubs),
        },
        total: allSubs.length,
      },
      submissionsMonthly: buildMonthly(allSubs),
      recentSubmitters,
    };
  },
  ["wwx-campaign-data"],
  { revalidate: 1800 }
);

export async function GET() {
  const data = await getCampaignData();
  return NextResponse.json(data);
}
