import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsCards } from "@/components/reporting/metrics-cards";
import { CampaignCharts } from "@/components/reporting/campaign-charts";
import { MqlTable } from "@/components/reporting/mql-table";

export default function PayoutsDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Payouts Promotion Campaign</h2>
        <div className="flex items-center space-x-2">
          {/* Mock export button */}
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Download Report
          </button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="social">Social & Video</TabsTrigger>
          <TabsTrigger value="email">Email & Workflow</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <MetricsCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <CampaignCharts type="completion" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="social" className="space-y-4">
           {/* Social and Video Mock Data Components */}
           <div className="grid gap-4 md:grid-cols-2">
              <CampaignCharts type="youtube" />
              <CampaignCharts type="linkedin" />
           </div>
        </TabsContent>
        <TabsContent value="email" className="space-y-4">
           <CampaignCharts type="email" />
        </TabsContent>
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <MqlTable />
            </div>
            <div className="col-span-3">
              <CampaignCharts type="lifecycle" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
