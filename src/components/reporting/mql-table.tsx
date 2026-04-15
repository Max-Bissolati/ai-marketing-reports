import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const mqlData = [
  { id: 1, name: "Alice Smith", company: "TechCorp", stage: "MQL", score: 85, lastTouch: "Webinar" },
  { id: 2, name: "Bob Jones", company: "GlobalTech", stage: "SQL", score: 92, lastTouch: "Demo Request" },
  { id: 3, name: "Charlie Brown", company: "StartUp Inc", stage: "MQL", score: 78, lastTouch: "Ebook Download" },
  { id: 4, name: "Diana Prince", company: "Amazonia", stage: "Opportunity", score: 98, lastTouch: "Sales Call" },
  { id: 5, name: "Evan Wright", company: "Wright Co", stage: "MQL", score: 81, lastTouch: "Email Click" },
]

export function MqlTable() {
  return (
    <Card className="bento-card border-0 shadow-none overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
         <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-2xl">Marketing Qualified Leads (MQLs)</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">High-intent leads sourced from the Payouts campaign.</CardDescription>
            </div>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                5 Active Leads
            </Badge>
         </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground py-4">Name</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">Company</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4">Stage</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4 text-right">Lead Score</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-4 text-right">Last Touch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mqlData.map((lead) => (
              <TableRow key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium py-5">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground py-5">{lead.company}</TableCell>
                <TableCell className="py-5">
                  <Badge variant={lead.stage === "Opportunity" ? "default" : lead.stage === "SQL" ? "secondary" : "outline"}
                         className={lead.stage === "Opportunity" ? "bg-primary text-primary-foreground" : lead.stage === "SQL" ? "bg-primary/20 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}>
                    {lead.stage}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-5 font-medium">
                    <span className={lead.score > 90 ? "text-primary" : ""}>{lead.score}</span>
                </TableCell>
                <TableCell className="text-right py-5 text-muted-foreground">{lead.lastTouch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
