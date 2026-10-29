import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SEVERITY_META } from "@/components/status";
import { cn } from "@/lib/utils";
import { Bell, AlertTriangle, CloudRain, Clock, CheckCircle2, ArrowRight } from "lucide-react";

const ICONS = { critical: AlertTriangle, warning: CloudRain, info: Clock, safe: CheckCircle2 };

export function NotificationPanel({ role, onDark = false }) {
  const { alerts } = useApp();
  const navigate = useNavigate();
  const seenKey = `ner_seen_alerts_${role}`;
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(() => Number(localStorage.getItem(seenKey) || 0));
  const unread = Math.max(0, alerts.length - lastSeen);

  const onOpenChange = (o) => {
    setOpen(o);
    if (o) { setLastSeen(alerts.length); localStorage.setItem(seenKey, String(alerts.length)); }
  };

  const goAll = () => { setOpen(false); navigate(role === "admin" ? "/admin/alerts" : "/app/alerts"); };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button data-testid="header-alerts" className={cn("relative rounded-lg p-2", onDark ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100")}>
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span data-testid="notif-unread-badge" className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" data-testid="notif-panel">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900 font-head">Notifications</p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase text-slate-500">{alerts.length} total</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {alerts.length === 0 && <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications.</p>}
          {alerts.slice(0, 8).map((a) => {
            const m = SEVERITY_META[a.severity] || SEVERITY_META.info;
            const Icon = ICONS[a.severity] || Clock;
            return (
              <button key={a.id} onClick={goAll} data-testid={`notif-item-${a.id}`}
                className="flex w-full items-start gap-2.5 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50">
                <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg", m.bg, m.text)}><Icon className="h-3.5 w-3.5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{a.title}</p>
                  <p className="truncate text-xs text-slate-500">{a.location}</p>
                  <span className="text-[10px] text-slate-400">{a.time}</span>
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={goAll} data-testid="notif-view-all" className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-2.5 text-xs font-semibold text-brand-dark hover:bg-slate-50">
          View all alerts <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </PopoverContent>
    </Popover>
  );
}
