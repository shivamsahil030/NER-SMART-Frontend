import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardCard({ title, icon: Icon, accent = "navy", children, className, testId, action }) {
  const accents = {
    navy: "text-navy-command bg-navy-command/10",
    safe: "text-emerald-600 bg-emerald-50",
    caution: "text-amber-600 bg-amber-50",
    hazard: "text-red-600 bg-red-50",
    ai: "text-cyan-600 bg-cyan-50",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      data-testid={testId}
      className={cn("card-elev rounded-xl border border-slate-200 bg-white p-5", className)}
    >
      {(title || Icon) && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {Icon && <span className={cn("grid h-8 w-8 place-items-center rounded-lg", accents[accent])}><Icon className="h-4 w-4" /></span>}
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 font-mono">{title}</h3>
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function StatTile({ label, value, sub, icon: Icon, tone = "navy", testId }) {
  const tones = {
    navy: "border-slate-200 text-navy-command",
    safe: "border-emerald-200 text-emerald-600",
    caution: "border-amber-200 text-amber-600",
    highrisk: "border-orange-200 text-orange-600",
    hazard: "border-red-200 text-red-600",
  };
  return (
    <div data-testid={testId} className={cn("card-elev rounded-xl border bg-white p-4", tones[tone])}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        {Icon && <Icon className="h-4 w-4 opacity-70" />}
      </div>
      <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
