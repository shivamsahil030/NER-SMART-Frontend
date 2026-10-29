import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AlertCard } from "@/components/AlertCard";
import { cn } from "@/lib/utils";
import { BellRing } from "lucide-react";
import { motion } from "framer-motion";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Information" },
];

export default function Alerts() {
  const { alerts } = useApp();
  const [filter, setFilter] = useState("all");
  const shown = alerts.filter((a) => filter === "all" || a.severity === filter || (filter === "info" && a.severity === "safe"));

  return (
    <div className="space-y-6" data-testid="alerts-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">Intelligent Alert Center</h1>
          <p className="text-sm text-slate-500">Real-time blockage, weather and delay advisories with recommended action.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-mono text-slate-600">
          <BellRing className="h-4 w-4 text-navy-command" /> {alerts.length} active
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.id} data-testid={`alert-filter-${f.id}`} onClick={() => setFilter(f.id)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.id ? "border-navy-command bg-navy-command text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
            {f.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-4 md:grid-cols-2">
        {shown.map((a, i) => <AlertCard key={a.id} alert={a} testId={`alert-${i}`} />)}
        {shown.length === 0 && <p className="col-span-2 rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-slate-400">No alerts in this category.</p>}
      </motion.div>
    </div>
  );
}
