import React, { useId, useMemo } from "react";
import { buildRouteBreakdown } from "@/data/mockData";
import { RISK_META } from "@/components/status";
import { DashboardCard } from "@/components/DashboardCard";
import { cn } from "@/lib/utils";
import { Mountain, TriangleAlert, Flag, MapPin, Ruler, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RouteBreakdown({ source, dest, route, onOpenGoogleMaps, testId = "route-breakdown" }) {
  const steps = useMemo(() => buildRouteBreakdown(source, dest, route), [source, dest, route]);
  const gid = "elev-" + useId().replace(/:/g, "");
  const maxEl = useMemo(() => Math.max(...steps.map((s) => s.elevation)) * 1.1, [steps]);
  const W = 100, H = 46;
  const pts = steps.map((s, i) => {
    const x = (i / (steps.length - 1)) * W;
    const y = H - (s.elevation / maxEl) * (H - 6) - 3;
    return { x, y, s };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <DashboardCard
      title="Route Breakdown"
      icon={Mountain}
      accent="navy"
      testId={testId}
      action={
        onOpenGoogleMaps && route ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenGoogleMaps(route)}
            className="h-7 gap-1 px-2 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            data-testid="breakdown-gmaps-btn"
          >
            <ExternalLink className="h-3 w-3" />
            Google Maps
          </Button>
        ) : null
      }
    >
      <p className="mb-3 text-xs text-slate-500">
        Step-by-step chokepoint & elevation profile for <span className="font-semibold text-slate-700">{route.label.split("—")[0].trim()}</span> (simulated).
      </p>

      {/* Elevation profile */}
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
          <span>Elevation profile</span><span>peak {Math.max(...steps.map((s) => s.elevation)).toLocaleString()} m</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-24 w-full">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3E62" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1E3E62" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={area} fill={`url(#${gid})`} />
          <polyline points={line} fill="none" stroke="#1E3E62" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          {pts.map((p) => (
            <circle key={p.s.name} cx={p.x} cy={p.y} r="1.8" fill={p.s.chokepoint ? (RISK_META[p.s.risk]?.color || "#1E3E62") : "#1E3E62"} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>

      {/* Steps timeline */}
      <div className="relative space-y-3 pl-1">
        {steps.map((st, i) => {
          const m = RISK_META[st.risk] || RISK_META.low;
          const Icon = i === 0 ? MapPin : i === steps.length - 1 ? Flag : st.chokepoint ? TriangleAlert : Mountain;
          return (
            <div key={st.name} data-testid={`breakdown-step-${i}`} className="relative flex gap-3">
              {i < steps.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-slate-200" />}
              <span className={cn("z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-white", m.border)} style={{ color: m.color }}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 font-head">{st.name}</h4>
                  {st.chokepoint && (
                    <span className={cn("rounded-full border px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase", m.bg, m.text, m.border)}>Chokepoint · {m.label}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{st.condition}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Ruler className="h-3 w-3" />{st.distanceKm} km</span>
                  <span className="flex items-center gap-1"><Mountain className="h-3 w-3" />{st.elevation.toLocaleString()} m</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{st.etaMin} min</span>
                  <span className="text-slate-300">·</span>
                  <span>{st.cumulativeKm} km total</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{st.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
