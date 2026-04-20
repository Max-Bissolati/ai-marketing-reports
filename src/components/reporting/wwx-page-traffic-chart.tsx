"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WWXPageTrafficData } from "@/types/reporting-types";

interface Props {
  data: WWXPageTrafficData;
}

function formatDate(iso: string) {
  const [, month, day] = iso.split("-");
  const d = new Date(iso);
  return `${d.toLocaleString("en", { month: "short" })} ${parseInt(day)}`;
}

const CHANNEL_COLORS: Record<string, string> = {
  "Organic Search": "#34d399",
  "Direct": "#22d3ee",
  "Organic Social": "#a78bfa",
  "Referral": "#fb923c",
  "Email": "#f472b6",
  "Paid Search": "#facc15",
  "(Other)": "#94a3b8",
};

function getChannelColor(channel: string) {
  return CHANNEL_COLORS[channel] ?? "#94a3b8";
}

export function WWXPageTrafficChart({ data }: Props) {
  const chartData = data.daily.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  return (
    <Card className="bento-card border-0 shadow-none h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>Landing Page Traffic</CardTitle>
            <CardDescription>
              Daily sessions · reports.peachpayments.com · GA4
            </CardDescription>
          </div>
          <Badge className="bg-white/5 text-muted-foreground border border-white/10 text-xs">
            GA4 Property 504639998
          </Badge>
        </div>

        {/* Totals row */}
        <div className="flex flex-wrap gap-6 mt-4">
          {[
            { label: "Total Sessions", value: data.totals.sessions.toLocaleString(), color: "text-primary" },
            { label: "Page Views", value: data.totals.pageViews.toLocaleString(), color: "text-[#22d3ee]" },
            { label: "Unique Users", value: data.totals.users.toLocaleString(), color: "text-[#34d399]" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[220px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 0, right: 10 }}>
              <defs>
                <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} opacity={0.3} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: "var(--muted-foreground)" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(7,10,67,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--foreground)", marginBottom: 4 }}
                itemStyle={{ color: "var(--muted-foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#sessionsGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "var(--primary)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel breakdown */}
        {data.channels.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.channels.slice(0, 6).map((ch) => (
              <div
                key={ch.channel}
                className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1 text-xs"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: getChannelColor(ch.channel) }}
                />
                <span className="text-foreground/80">{ch.channel}</span>
                <span className="text-muted-foreground">{ch.sessions.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
