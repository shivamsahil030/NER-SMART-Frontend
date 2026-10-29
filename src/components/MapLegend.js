import React from "react";
import { cn } from "@/lib/utils";

export function MapLegend({ className, testId = "map-legend" }) {
  const items = [
    { c: "#10B981", label: "Open" },
    { c: "#F59E0B", label: "Partially / Warning" },
    { c: "#F97316", label: "High Risk" },
    { c: "#EF4444", label: "Blocked" },
    { c: "#0056B3", label: "Vehicle", shape: "circle" },
    { c: "#EF4444", label: "Incident", shape: "triangle" },
  ];
  return (
    <div data-testid={testId} className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 backdrop-blur", className)}>
      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">Legend</span>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-xs text-slate-600">
          {it.shape === "circle" ? (
            <span className="h-2.5 w-2.5 rounded-full border border-white ring-1 ring-slate-300" style={{ background: it.c }} />
          ) : it.shape === "triangle" ? (
            <span className="h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent" style={{ borderBottomColor: it.c }} />
          ) : (
            <span className="h-2 w-4 rounded-full" style={{ background: it.c }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}
