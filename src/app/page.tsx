import Link from "next/link";

const campaigns = [
  {
    name: "Travel 2026",
    description: "Live HubSpot attribution data for the Travel campaign",
    href: "/travel-campaign-2026",
    status: "Active",
    live: true,
  },
  {
    name: "Payouts 2026",
    description: "Campaign retrospective with presentation data",
    href: "/payouts-campaign-2026",
    status: "Completed",
    live: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-14 max-w-[1200px] mx-auto relative">
      <img
        src="/Peach Payments Pattern Background Top Section - Compressed.avif"
        alt="Background Pattern"
        className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      <div className="relative">
        <div className="text-center mb-12 pt-8">
          <p className="text-muted-foreground text-sm tracking-wide uppercase font-medium mb-3">
            Peach Payments
          </p>
          <h1 className="text-5xl md:text-6xl font-heading tracking-tight mb-4">
            <span className="text-gradient-brand">Campaign Reports</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Marketing attribution dashboards powered by HubSpot, N8N, and Sink
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {campaigns.map((campaign) => (
            <Link key={campaign.href} href={campaign.href}>
              <div className="bento-card p-8 h-full group relative overflow-hidden hover:border-primary/30 transition-colors cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors duration-500" />
                <div className="flex items-center gap-2 mb-3">
                  {campaign.live && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                    </span>
                  )}
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      campaign.live ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{campaign.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {campaign.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/skills"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Marketing Skills &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
