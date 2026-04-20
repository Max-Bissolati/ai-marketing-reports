"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { WWXSubmitter } from "@/types/reporting-types";

interface Props {
  submitters: WWXSubmitter[];
}

export function WWXSubmittersTable({ submitters }: Props) {
  const [search, setSearch] = useState("");

  const filtered = submitters.filter((s) =>
    `${s.firstname} ${s.lastname} ${s.email} ${s.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Card className="bento-card border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Report Downloaders</CardTitle>
            <CardDescription>
              Contacts who submitted the main download form
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider hidden md:table-cell">Company</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                    No results found
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium">
                      {s.firstname || s.lastname
                        ? `${s.firstname} ${s.lastname}`.trim()
                        : "—"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground font-mono text-xs">
                      {s.email}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground hidden md:table-cell">
                      {s.company || "—"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">
                      {new Date(s.submittedAt).toLocaleDateString("en-ZA", {
                        dateStyle: "medium",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
