import React from "react";
import { cn } from "@/lib/utils";
import { SEVERITY_META } from "@/components/status";
import { MapPin, Camera, Clock, User } from "lucide-react";

export function IncidentCard({ incident, testId, footer }) {
  const m = SEVERITY_META[incident.severity] || SEVERITY_META.info;
  return (
    <div data-testid={testId} className="card-elev rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold uppercase", m.bg, m.text, m.border)}>{incident.severity}</span>
            <span className="font-mono text-xs text-slate-400">{incident.id}</span>
          </div>
          <h4 className="mt-1.5 text-sm font-semibold text-slate-900 font-head">{incident.type}</h4>
        </div>
        <StatusChip status={incident.status} />
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{incident.location}</p>
      <p className="mt-1.5 text-sm text-slate-600">{incident.description}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><User className="h-3 w-3" />{incident.reportedBy}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{incident.time}</span>
        {incident.photo && <span className="flex items-center gap-1 text-navy-command"><Camera className="h-3 w-3" />Photo evidence</span>}
      </div>
      {footer && <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div>}
    </div>
  );
}

export function StatusChip({ status }) {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    verified: "bg-blue-50 text-blue-700 border-blue-200",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase", map[status] || map.pending)}>{status}</span>;
}
