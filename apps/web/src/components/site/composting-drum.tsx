"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CompostingDrum3D = dynamic(() => import("./composting-drum-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-[#0d1007]">
      <div className="flex items-center gap-3">
        <span className="size-4 animate-spin rounded-full border border-lime/25 border-t-lime" />
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-paper/40">
          Starting the drum
        </span>
      </div>
    </div>
  ),
});

export function CompostingDrum({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  return (
    <div className={cn("relative size-full", className)}>
      <CompostingDrum3D height="100%" onReady={() => setReady(true)} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[#0d1007] transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
