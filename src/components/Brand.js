import React from "react";
import { cn } from "@/lib/utils";

// NER SMART LOGISTICS emblem — geometric hexagon route mark.
export function Brand({ dark = false, className, size = "md" }) {
  const dims = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className={cn("relative grid shrink-0 place-items-center rounded-xl bg-brand shadow-[0_6px_20px_rgba(124,179,66,0.35)]", dims)}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 3 7v10l9 5 9-5V7z" />
          <path d="M12 7v10M7.5 9.5 12 12l4.5-2.5" />
        </svg>
      </span>
      <div className="leading-none">
        <p className={cn("font-head text-lg font-extrabold tracking-tight", dark ? "text-white" : "text-ink")}>
          NER <span className="text-brand">SMART</span>
        </p>
        <p className={cn("text-[9px] font-mono font-semibold uppercase tracking-[0.22em]", dark ? "text-slate-400" : "text-slate-500")}>
          Logistics system
        </p>
      </div>
    </div>
  );
}
