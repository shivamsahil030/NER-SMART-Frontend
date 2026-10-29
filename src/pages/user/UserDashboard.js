import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Truck, Navigation, AlertTriangle, Ban, CloudRain, CheckCircle2, Brain, MapPin, ArrowRight,
} from "lucide-react";

const STATS = [
  { label: "ACTIVE TRIP", value: "1", tone: "border-l-brand text-ink" },
  { label: "OPEN ROUTES", value: "186", tone: "border-l-slate-300 text-ink" },
  { label: "HIGH RISK SECTORS", value: "17", tone: "border-l-amber-400 text-amber-600" },
  { label: "BLOCKED SECTORS", value: "6", tone: "border-l-red-400 text-red-600" },
];

const HAZARDS = [
  { name: "Kopili River Flooding", status: "STABLE", color: "text-brand-dark" },
  { name: "Banderdewa Landslide Zone", status: "MONITORED", color: "text-amber-600" },
  { name: "Balipara Loop Access", status: "OPEN", color: "text-brand-dark" },
];

export default function UserDashboard() {
  const { auth, roads, vehicles, incidents, alerts, weather, activeTrip, disruptions } = useApp();

  // Dynamic statistics calculated from live state
  const activeTripsCount = vehicles.filter(
    (v) => v.status === "In Transit" || v.status === "ON_ROUTE" || v.status === "Priority Transit"
  ).length || 1;

  const openRoutesCount = roads.filter((r) => r.status === "open").length;
  const highRiskCount = roads.filter((r) => r.status === "highrisk" || r.status === "warning").length;
  const blockedCount = roads.filter((r) => r.status === "blocked").length;

  const dynamicStats = [
    { label: "ACTIVE TRIP", value: String(activeTripsCount), tone: "border-l-brand text-ink" },
    { label: "OPEN ROUTES", value: String(openRoutesCount), tone: "border-l-slate-300 text-ink" },
    { label: "HIGH RISK SECTORS", value: String(highRiskCount), tone: "border-l-amber-400 text-amber-600" },
    { label: "BLOCKED SECTORS", value: String(blockedCount), tone: "border-l-red-400 text-red-600" },
  ];

  // Dynamic hazards scan from incidents/disruptions
  const activeHazards = (incidents.length > 0 ? incidents : disruptions).slice(0, 3).map((item) => ({
    name: item.location || item.type || "Corridor Watch",
    status: (item.status || "MONITORED").toUpperCase(),
    color:
      item.severity === "critical" || item.severity === "HIGH"
        ? "text-red-600"
        : item.severity === "warning" || item.severity === "MEDIUM"
        ? "text-amber-600"
        : "text-brand-dark",
  }));

  const fallbackHazards = [
    { name: "Kopili River Flooding", status: "STABLE", color: "text-brand-dark" },
    { name: "Banderdewa Landslide Zone", status: "MONITORED", color: "text-amber-600" },
    { name: "Balipara Loop Access", status: "OPEN", color: "text-brand-dark" },
  ];

  const displayHazards = activeHazards.length >= 2 ? activeHazards : fallbackHazards;

  // Dynamic weather calculations
  const weatherRisk =
    (weather?.rainfall || 0) > 15 || weather?.condition?.toLowerCase().includes("heavy")
      ? "Medium Risk"
      : "Low Risk";

  const weatherRiskTone =
    weatherRisk === "Medium Risk" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600";

  // Dynamic recent activities from live alerts & incidents
  const recentItems = [
    ...alerts.slice(0, 2).map((a) => ({
      icon: a.severity === "critical" ? AlertTriangle : CloudRain,
      color: a.severity === "critical" ? "text-red-600" : "text-amber-600",
      text: `${a.title} — ${a.location}`,
      time: a.time || "Recently",
    })),
    ...incidents.slice(0, 2).map((inc) => ({
      icon: CheckCircle2,
      color: "text-brand-dark",
      text: `${inc.type} reported near ${inc.location}`,
      time: inc.time || "Recently",
    })),
  ];

  const defaultActivities = [
    { icon: CheckCircle2, color: "text-brand-dark", text: "Checkpoint cleared near Nagaon — on schedule", time: "6 min ago" },
    { icon: CloudRain, color: "text-amber-600", text: "Weather advisory updated for NH-15 sector", time: "22 min ago" },
    { icon: Truck, color: "text-navy-command", text: `Trip ${activeTrip?.id || "NER-MED-102"} departed depot`, time: "1 hr ago" },
    { icon: AlertTriangle, color: "text-red-600", text: "Landslide watch issued — Arunachal border loop", time: "2 hr ago" },
  ];

  const displayActivities = recentItems.length >= 3 ? recentItems.slice(0, 4) : defaultActivities;

  const driverFirstName = auth?.name?.split(" ")[0] || "Driver";
  const riskScore = activeTrip?.riskScore ?? 28;
  const confidenceScore = Math.min(96, Math.max(68, 100 - riskScore));

  return (
    <div className="space-y-6" data-testid="user-dashboard">
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">Good morning, {driverFirstName}</h1>
        <p className="text-sm text-slate-500">Stay informed. Travel safer.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dynamicStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            data-testid={`stat-${i}`} className={cn("rounded-xl border border-l-4 border-slate-200 bg-white p-4 card-elev", s.tone)}>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={cn("mt-2 font-mono text-3xl font-bold", s.tone)}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active trip */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 card-elev" data-testid="active-trip-card">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-dark">
                <span className="h-2 w-2 rounded-full bg-brand" /> Active Trip · {activeTrip?.status || "In Transit"}
              </span>
              <span className="font-mono text-xs text-slate-400">{activeTrip?.id || "NER-MED-102"}</span>
            </div>
            <h2 className="mt-3 font-head text-xl font-bold text-ink">{activeTrip?.title || activeTrip?.goods || "Medical Supply Delivery"}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              {activeTrip?.source || "Guwahati (AS)"} <ArrowRight className="h-4 w-4 text-brand-dark" /> {activeTrip?.dest || "Itanagar (AR)"}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              <Info label="ETA" value={activeTrip?.eta || "4h 35m"} />
              <Info label="Terrain Risk" value={activeTrip?.risk || "LOW"} valueClass="text-brand-dark" />
              <Info label="Last Sync" value={activeTrip?.lastSync || "Just now"} />
            </div>
            <Link to="/app/tracking"><Button data-testid="view-tracking-btn" className="mt-4 w-full gap-2 bg-forest hover:bg-ink">
              <MapPin className="h-4 w-4" /> View Live Tracking Map
            </Button></Link>
          </div>

          {/* Weather */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 card-elev" data-testid="weather-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Weather Report (On Route)</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase", weatherRiskTone)}>{weatherRisk}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <CloudRain className="h-9 w-9 text-navy-command" />
              <div>
                <p className="font-head text-lg font-bold text-ink">{weather?.condition || "Monsoon Weather Advisory"}</p>
                <p className="text-xs text-slate-500">{weather?.location || "On route to " + (activeTrip?.dest || "Itanagar")} · {weather?.temperature ?? 24}°C · Precipitation {weather?.humidity ?? 88}%</p>
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-600">
              "{weather?.warning || 'Heavy rainfall expected across mountain sectors. Drive with caution and maintain safe convoy spacing.'}"
            </p>
          </div>
        </div>

        {/* Right: AI insights */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 card-elev" data-testid="ai-insights-card">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-bold text-ink font-head"><Brain className="h-4 w-4 text-brand-dark" /> AI Route Insights</span>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-brand-dark">Prototype AI Prediction</span>
          </div>

          <div className="mt-4 space-y-3">
            <Metric label="Disruption Risk Score" value={`${riskScore}%`} valueClass={riskScore > 50 ? "text-amber-600" : "text-brand-dark"} />
            <Metric label="Route Confidence" value={`${confidenceScore}%`} valueClass="text-ink" />
            <Metric label="Prediction Model" value="NER-GeoDisrupt-v2" valueClass="text-slate-600 text-sm" />
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">Recommendation</p>
            <div className="mt-1.5 flex items-start gap-2 rounded-lg border border-brand/30 bg-brand/5 p-3 text-sm text-brand-dark">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{riskScore > 50 ? "Caution advised near vulnerable loops. Northern alternate corridor active." : `Continue current route. ${activeTrip?.corridor || "NH corridor"} is stable with zero reported blockages.`}</span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">Terrain Hazards Scan</p>
            <div className="mt-2 space-y-2">
              {displayHazards.map((h) => (
                <div key={h.name} className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-sm">
                  <span className="text-slate-600">{h.name}</span>
                  <span className={cn("font-mono text-xs font-bold", h.color)}>{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions + recent activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 card-elev lg:col-span-1" data-testid="quick-actions">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Quick Actions</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { to: "/app/plan", icon: Navigation, label: "Plan Route" },
              { to: "/app/tracking", icon: Truck, label: "Live Tracking" },
              { to: "/app/report", icon: AlertTriangle, label: "Report Incident" },
              { to: "/app/alerts", icon: Ban, label: "View Alerts" },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition-colors hover:border-brand hover:bg-brand/5">
                <a.icon className="h-5 w-5 text-brand-dark" />
                <span className="text-xs font-medium text-ink">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 card-elev lg:col-span-2" data-testid="recent-activity">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Recent Activity</p>
          <div className="mt-3 space-y-2.5">
            {displayActivities.map((r) => (
              <div key={r.text} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                <r.icon className={cn("h-4 w-4 shrink-0", r.color)} />
                <span className="flex-1 text-sm text-slate-700">{r.text}</span>
                <span className="text-[11px] text-slate-400">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, valueClass }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{label}</p>
      <p className={cn("mt-0.5 font-head text-base font-semibold text-ink", valueClass)}>{value}</p>
    </div>
  );
}
function Metric({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={cn("font-mono text-lg font-bold", valueClass)}>{value}</span>
    </div>
  );
}
