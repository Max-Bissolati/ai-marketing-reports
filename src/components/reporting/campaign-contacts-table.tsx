"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CampaignContact } from "@/types/reporting-types";

const STAGE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  customer: "default",
  salesqualifiedlead: "default",
  marketingqualifiedlead: "secondary",
  lead: "outline",
  other: "outline",
};

const STAGE_LABEL: Record<string, string> = {
  lead: "Lead",
  marketingqualifiedlead: "MQL",
  salesqualifiedlead: "SQL",
  opportunity: "Opportunity",
  customer: "Customer",
  other: "Other",
};

const SOURCE_LABEL: Record<string, string> = {
  linkedin: "LinkedIn",
  email: "Email",
  main_website: "Website",
  table_talker: "QR Code",
  press_release: "Press",
};

interface CampaignContactsTableProps {
  contacts: CampaignContact[];
}

export function CampaignContactsTable({
  contacts,
}: CampaignContactsTableProps) {
  const sorted = [...contacts].sort((a, b) => {
    const stageOrder: Record<string, number> = {
      customer: 0,
      salesqualifiedlead: 1,
      marketingqualifiedlead: 2,
      lead: 3,
      other: 4,
    };
    return (stageOrder[a.lifecyclestage] ?? 5) - (stageOrder[b.lifecyclestage] ?? 5);
  });

  return (
    <Card className="bento-card border-0 shadow-none overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Campaign Contacts</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              All contacts attributed to this campaign via UTM tracking
            </CardDescription>
          </div>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
            {contacts.length} Contacts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground py-4">
                Name
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">
                Company
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">
                Stage
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">
                Channel
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4 text-right">
                Touches
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4 text-right">
                Assisted
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((contact, index) => {
              const stage = contact.lifecyclestage || "other";
              const variant = STAGE_VARIANT[stage] || "outline";
              return (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.03,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="font-medium py-4">
                    <a
                      href={contact.hubspotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {contact.firstname} {contact.lastname}
                      <span className="block text-xs text-muted-foreground font-normal">
                        {contact.email}
                      </span>
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4">
                    {contact.company || "—"}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={variant}
                      className={
                        variant === "default"
                          ? "bg-primary text-primary-foreground"
                          : variant === "secondary"
                            ? "bg-primary/20 text-primary border-primary/20"
                            : "bg-white/5 text-muted-foreground border-white/10"
                      }
                    >
                      {STAGE_LABEL[stage] || stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-muted-foreground">
                    <span className="text-sm">
                      {SOURCE_LABEL[contact.utmSource] || contact.utmSource}
                    </span>
                    <span className="block text-xs opacity-60">
                      {contact.utmMedium}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4 font-medium">
                    <span
                      className={contact.touchCount > 1 ? "text-primary" : ""}
                    >
                      {contact.touchCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    {contact.marketingAssisted === "yes" ? (
                      <span className="text-primary text-sm font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
