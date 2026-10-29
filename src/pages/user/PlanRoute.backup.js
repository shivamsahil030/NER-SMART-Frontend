import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CITY_LIST, GOODS_TYPES, buildRouteOptions, CITIES } from "@/data/mockData";
import { DashboardCard } from "@/components/DashboardCard";
import { RouteCard } from "@/components/RouteCard";
import { RiskCard } from "@/components/RiskCard";
import { RouteBreakdown } from "@/components/RouteBreakdown";
import NERMap from "@/components/NERMap";
import { MapLegend } from "@/components/MapLegend";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, Navigation, Package, Search, Sparkles, Loader2 } from "lucide-react";

export default function PlanRoute() {
  const { emergencyMode, roads, incidents } = useApp();
  const [source, setSource] = useState("guwahati");
  const [dest, setDest] = useState("itanagar");
  const [goods, setGoods] = useState("medicine");
  const [routes, setRoutes] = useState(null);
  const [selected, setSelected] = useState("A");
  const [loading, setLoading] = useState(false);

  const find = () => {
    if (source === dest) { toast.error("Source and destination must differ."); return; }
    setLoading(true);
    setRoutes(null);
    setTimeout(() => {
      const opts = buildRouteOptions(source, dest, goods);
      setRoutes(opts);
      setSelected("A");
      setLoading(false);
      toast.success("AI analysed weather + road risk — safest route recommended.");
    }, 1100);
  };

  const selRoute = routes?.find((r) => r.id === selected);
  const overlay = selRoute ? [{ from: CITIES[source], to: CITIES[dest], risk: selRoute.risk }] : null;

  const dispatch = (route) => {
    toast.success(`Convoy dispatched via ${route.label.split("—")[0].trim()} · ${CITIES[source].name} → ${CITIES[dest].name}`, {
      description: "Simulated dispatch — live tracking enabled.",
    });
  };

  return (
    <div className="space-y-6" data-testid="plan-route-page">
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">Plan the Safest Route</h1>
        <p className="text-sm text-slate-500">AI compares corridors on distance, ETA, weather and disaster risk.</p>
      </div>

      <DashboardCard title="Route Planner" icon={Navigation} testId="route-planner-form">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label className="text-slate-600">Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="mt-1.5" data-testid="source-select"><SelectValue /></SelectTrigger>
              <SelectContent>{CITY_LIST.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-600">Destination</Label>
            <Select value={dest} onValueChange={setDest}>
              <SelectTrigger className="mt-1.5" data-testid="dest-select"><SelectValue /></SelectTrigger>
              <SelectContent>{CITY_LIST.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-600">Vehicle / Goods Type</Label>
            <Select value={goods} onValueChange={setGoods}>
              <SelectTrigger className="mt-1.5" data-testid="goods-select"><SelectValue /></SelectTrigger>
              <SelectContent>{GOODS_TYPES.map((g) => <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={find} disabled={loading} className="w-full gap-2 bg-navy-command hover:bg-navy" data-testid="find-route-btn">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Analysing..." : "Find Safest Route"}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-10 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-navy-command" /> AI computing terrain, rainfall & landslide risk…
        </div>
      )}

      {routes && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <DashboardCard title="Route Map" icon={MapPin} testId="route-result-map">
              <NERMap roads={roads} vehicles={[]} incidents={incidents} routeOverlay={overlay} emergencyMode={emergencyMode} height={360} />
              <MapLegend className="mt-3" />
            </DashboardCard>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <Sparkles className="h-4 w-4" /> <span className="font-semibold">AI Recommended Route:</span> Route A — Primary Corridor (lowest risk)
            </div>
            <RiskCard route={`${CITIES[source].name} → ${CITIES[dest].name}`}
              riskScore={selRoute?.riskScore || 22} riskLevel={selRoute?.risk || "low"}
              cause={selRoute?.id === "C" ? "Heavy rainfall + historical landslide pattern" : "Moderate monsoon activity on corridor"}
              action={selRoute?.recommended ? "Proceed — this is the safest option" : "Prefer Route A (AI recommended)"}
              delay={selRoute?.delay || "+5 min"} confidence={86} />
            {selRoute && <RouteBreakdown source={source} dest={dest} route={selRoute} />}
          </div>
          <div className="space-y-4">
            <p className="font-head text-sm font-semibold uppercase tracking-wide text-slate-500">Route Options</p>
            {routes.map((r) => (
              <RouteCard key={r.id} route={r} selected={selected === r.id} onSelect={() => setSelected(r.id)} onDispatch={dispatch} testId={`route-card-${r.id}`} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
