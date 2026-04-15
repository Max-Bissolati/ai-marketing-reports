import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/travel-campaign-2026",
        destination: "/reporting/travel-2026",
      },
      {
        source: "/payouts-campaign-2026",
        destination: "/reporting/payouts",
      },
    ];
  },
};

export default nextConfig;
