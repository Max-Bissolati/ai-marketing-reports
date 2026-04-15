import type { Metadata } from "next";
import { Sora, Rethink_Sans } from "next/font/google";
import { SvgFilters } from "@/components/ui/svg-filters";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Marketing Reporting Dashboard",
  description: "Reporting dashboard for AI Marketing Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rethinkSans.variable} ${sora.variable} font-sans antialiased`}
      >
        {/* SVG Filters for frosted glass effects */}
        <SvgFilters enableAnimations={true} />
        {children}
      </body>
    </html>
  );
}
