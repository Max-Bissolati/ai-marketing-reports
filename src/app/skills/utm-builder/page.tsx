"use client";

import { UTMBuilderFlow } from "@/components/skills/utm/utm-builder-flow";

export default function UTMBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full">
        <UTMBuilderFlow />
      </div>
    </div>
  );
}
