import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import NERMap from "@/components/NERMap";
import RealMap from "@/components/RealMap";
import { MapLegend } from "@/components/MapLegend";
import { cn } from "@/lib/utils";
import { Layers, Filter, Map as MapIcon } from "lucide-react";

const ROAD_FILTERS = [
  { id: "all", label: "All Roads" },
  { id: "blocked", label: "Blocked" },
  { id: "highrisk", label: "High Risk" },
  { id: "warning", label: "Warning" },
  { id: "open", label: "Open" },
];

export default function MapView() {
  const { roads, vehicles, incidents, emergencyMode } = useApp();
  const [mapMode, setMapMode] = useState("real"); // "real" | "schematic"
  const [roadFilter, setRoadFilter] = useState("all");
  const [showVehicles, setShowVehicles] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  const filteredRoads = roadFilter === "all" ? roads : roads.filter((r) => r.status === roadFilter);

  return (
    <div className="space-y-4" data-testid="map-view-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">Interactive Network Map</h1>
          <p className="text-sm text-slate-500">Click a road, vehicle or incident marker for live details.</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            data-testid="mapview-toggle-real"
            onClick={() => setMapMode("real")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              mapMode === "real"
                ? "bg-white text-navy-command shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <MapIcon className="h-3.5 w-3.5 text-blue-600" />
            Real Map (OSM / Satellite)
          </button>
          <button
            type="button"
            data-testid="mapview-toggle-schematic"
            onClick={() => setMapMode("schematic")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              mapMode === "schematic"
                ? "bg-white text-navy-command shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <span className="text-xs">📐</span>
            Schematic
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <span className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400"><Filter className="h-3.5 w-3.5" /> Filters</span>
        {ROAD_FILTERS.map((f) => (
          <button key={f.id} data-testid={`map-filter-${f.id}`} onClick={() => setRoadFilter(f.id)}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              roadFilter === f.id ? "border-navy-command bg-navy-command text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
            {f.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-slate-200" />
        <button data-testid="toggle-vehicles" onClick={() => setShowVehicles((v) => !v)} className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", showVehicles ? "border-navy-command bg-navy-command/5 text-navy-command" : "border-slate-200 text-slate-400")}>
          <Layers className="h-3.5 w-3.5" /> Vehicles
        </button>
        <button data-testid="toggle-incidents" onClick={() => setShowIncidents((v) => !v)} className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", showIncidents ? "border-navy-command bg-navy-command/5 text-navy-command" : "border-slate-200 text-slate-400")}>
          <Layers className="h-3.5 w-3.5" /> Incidents
        </button>
      </div>

      {mapMode === "real" ? (
        <RealMap
          roads={filteredRoads}
          vehicles={showVehicles ? vehicles : []}
          incidents={showIncidents ? incidents : []}
          emergencyMode={emergencyMode}
          height={600}
        />
      ) : (
        <NERMap
          roads={filteredRoads}
          vehicles={showVehicles ? vehicles : []}
          incidents={showIncidents ? incidents : []}
          emergencyMode={emergencyMode}
          height={600}
        />
      )}
      <MapLegend />
    </div>
  );
}
