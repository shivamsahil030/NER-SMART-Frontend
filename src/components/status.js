// Shared status helpers, badges and small UI atoms for NER-SMART.
import React from "react";
import { cn } from "@/lib/utils";

export const STATUS_META = {
  open: { label: "Open", color: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  warning: { label: "Warning", color: "#F59E0B", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  highrisk: { label: "High Risk", color: "#F97316", text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500" },
  blocked: { label: "Blocked", color: "#EF4444", text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
};

export const RISK_META = {
  low: { label: "LOW", color: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  medium: { label: "MEDIUM", color: "#F59E0B", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  high: { label: "HIGH", color: "#EF4444", text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
};

export const SEVERITY_META = {
  critical: { label: "Critical", color: "#EF4444", text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
  warning: { label: "Warning", color: "#F59E0B", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  info: { label: "Information", color: "#0056B3", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  safe: { label: "Resolved", color: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
};

export function StatusBadge({ status, className, testId }) {
  const m = STATUS_META[status] || STATUS_META.open;
  return (
    <span data-testid={testId} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider", m.bg, m.text, m.border, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export function RiskBadge({ risk, className }) {
  const m = RISK_META[risk] || RISK_META.low;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider", m.bg, m.text, m.border, className)}>
      RISK: {m.label}
    </span>
  );
}
