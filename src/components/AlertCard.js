import React from "react";
import { cn } from "@/lib/utils";
import { SEVERITY_META } from "@/components/status";
import { AlertTriangle, CloudRain, Clock, CheckCircle2, MapPin, ArrowRight } from "lucide-react";

const ICONS = { critical: AlertTriangle, warning: CloudRain, info: Clock, safe: CheckCircle2 };

export function AlertCard({ alert, testId }) {
  const m = SEVERITY_META[alert.severity] || SEVERITY_META.info;
  const Icon = ICONS[alert.severity] || Clock;
  return (
    <div data-testid={testId} className={cn("card-elev rounded-xl border-l-4 border border-slate-200 bg-white p-4", m.border)} style={{ borderLeftColor: m.color }}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg", m.bg, m.text)}><Icon className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider", m.bg, m.text, m.border)}>{m.label}</span>
            <span className="text-xs text-slate-400">{alert.time}</span>
          </div>
          <h4 className="mt-1.5 text-sm font-semibold text-slate-900 font-head">{alert.title}</h4>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{alert.location}</p>
          <p className="mt-1.5 text-sm text-slate-600">{alert.description}</p>
          <p className="mt-2 flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700">
            <ArrowRight className="h-3 w-3 text-navy-command" /> {alert.action}
          </p>
        </div>
      </div>
    </div>
  );
}
