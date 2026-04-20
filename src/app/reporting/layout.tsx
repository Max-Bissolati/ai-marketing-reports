import { ReportNav } from "@/components/reporting/report-nav";

export default function ReportingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReportNav />
      {children}
    </>
  );
}
