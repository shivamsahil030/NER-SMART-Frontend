import React from "react";
import { cn } from "@/lib/utils";
import { RISK_META } from "@/components/status";
import { Brain, TrendingUp, AlertTriangle, Navigation2, Clock, Gauge } from "lucide-react";

// AI Route Intelligence panel (simulated prediction).
export function RiskCard({ route = "Guwahati → Itanagar", riskScore = 72, riskLevel = "high", cause = "Heavy rainfall + historical landslide pattern", action = "Use Alternate Route B", delay = "+35 minutes", confidence = 86, testId = "ai-risk-panel" }) {
  const m = RISK_META[riskLevel] || RISK_META.high;
  return (
    <div data-testid={testId} className="relative overflow-hidden rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50/70 to-white p-5 card-elev">
      <div className="grain absolute inset-0" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-100 text-cyan-700"><Brain className="h-5 w-5" /></span>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-900 font-head">AI ROUTE INTELLIGENCE</h3>
              <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-700">AI prediction engine</p>
            </div>
          </div>
          <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-mono font-bold uppercase", m.bg, m.text, m.border)}>{m.label}</span>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="relative grid h-20 w-20 place-items-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={m.color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(riskScore / 100) * 213.6} 213.6`} />
            </svg>
            <div className="text-center">
              <p className="font-mono text-xl font-bold text-slate-900">{riskScore}%</p>
              <p className="text-[9px] uppercase text-slate-400">risk</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Route</p>
            <p className="text-base font-semibold text-slate-900 font-head">{route}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><Gauge className="h-3.5 w-3.5" /> Confidence <span className="font-mono font-semibold text-slate-700">{confidence}%</span></div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <AiRow icon={AlertTriangle} label="Predicted Cause" value={cause} />
          <AiRow icon={Navigation2} label="Recommended Action" value={action} highlight />
          <AiRow icon={Clock} label="Expected Delay" value={delay} />
        </div>
      </div>
    </div>
  );
}

function AiRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className={cn("flex items-start gap-2.5 rounded-lg px-3 py-2", highlight ? "bg-cyan-100/60" : "bg-white/60")}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{label}</p>
        <p className={cn("text-sm", highlight ? "font-semibold text-cyan-800" : "text-slate-700")}>{value}</p>
      </div>
    </div>
  );
}
