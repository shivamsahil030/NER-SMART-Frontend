import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/context/AppContext";
import { CITIES } from "@/data/mockData";
import { DashboardCard, StatTile } from "@/components/DashboardCard";
import NERMap from "@/components/NERMap";
import RealMap from "@/components/RealMap";
import { MapLegend } from "@/components/MapLegend";
import { RiskBadge } from "@/components/status";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Truck,
  Gauge,
  Clock,
  Navigation,
  Siren,
  MapPin,
  CheckCircle2,
  Circle,
  Loader2,
  Map as MapIcon,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function LiveTracking() {
  const {
    vehicles: contextVehicles,
    roads,
    incidents,
    emergencyMode,
  } = useApp();

  const [vehicles, setVehicles] =
    useState(contextVehicles || []);

  const [gpsData, setGpsData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selId, setSelId] =
    useState(null);

  const [mapMode, setMapMode] =
    useState("real"); // "real" | "schematic"

  /*
   * Convert backend vehicle format
   * into the format expected by the
   * existing frontend UI.
   */
  const normalizeVehicle = (veh) => {
    const shipmentId =
      String(
        veh.shipmentId ||
          veh.shipment_id ||
          "1"
      );

    const backendStatus =
      String(
        veh.status || "UNKNOWN"
      ).toUpperCase();

    let status = backendStatus;

    if (backendStatus === "ON_ROUTE") {
      status = "IN TRANSIT";
    }

    return {
      ...veh,

      id:
        veh.id ||
        veh.vehicleId ||
        veh.vehicle_id,

      shipmentId,

      speed:
        Number(
          veh.speed ??
            veh.currentSpeedKmph ??
            0
        ),

      currentSpeedKmph:
        Number(
          veh.speed ??
            veh.currentSpeedKmph ??
            0
        ),

      progress:
        Number(
          veh.progress ?? 0
        ),

      etaMin:
        Number(
          veh.etaMin ?? 330
        ),

      status,

      risk:
        veh.risk ||
        (
          backendStatus ===
          "MAINTENANCE"
            ? "high"
            : "low"
        ),

      driver:
        veh.driver ||
        "Demo Driver",

      goods:
        veh.goods ||
        "Essential Goods",

      source:
        veh.source ||
        "guwahati",

      dest:
        veh.dest ||
        "shillong",
    };
  };

  /*
   * Load vehicles + GPS from backend.
   */
  const loadTrackingData = useCallback(async () => {
    try {
      setLoading(true);

      const vehicleResponse =
        await axios.get(
          `${API_URL}/vehicles/`
        );

      const backendVehicles =
        vehicleResponse.data?.vehicles ||
        [];

      const normalized =
        backendVehicles.map(
          normalizeVehicle
        );

      if (normalized.length > 0) {
        setVehicles(normalized);

        setSelId((current) => {
          if (
            current &&
            normalized.some(
              (v) => v.id === current
            )
          ) {
            return current;
          }

          return normalized[0].id;
        });
      }

      /*
       * GPS belongs to a shipment.
       * Our main demo shipment is shipment 1.
       */
      const gpsResponse =
        await axios.get(
          `${API_URL}/gps/1`
        );

      setGpsData(
        gpsResponse.data || null
      );

      console.log(
        "NER SMART: Live tracking data loaded"
      );
    } catch (error) {
      console.warn(
        "NER SMART: Live tracking backend unavailable. Using existing demo data.",
        error.message
      );

      const fallback =
        (contextVehicles || []).map(
          normalizeVehicle
        );

      setVehicles(fallback);

      if (
        fallback.length > 0
      ) {
        setSelId(
          fallback[0].id
        );
      }
    } finally {
      setLoading(false);
    }
  }, [contextVehicles]);

  useEffect(() => {
    loadTrackingData();
  }, [loadTrackingData]);

  /*
   * Refresh backend vehicle data
   * every 5 seconds.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      loadTrackingData();
    }, 5000);
  
    return () => clearInterval(interval);
  }, [loadTrackingData]);

  const v =
    vehicles.find(
      (x) => x.id === selId
    ) ||
    vehicles[0] ||
    normalizeVehicle({
      id: "N/A",
      status: "UNKNOWN",
    });

  const progress = Math.min(
    1,
    Math.max(
      0,
      Number(v.progress || 0)
    )
  );

  const stageIdx =
    progress >= 0.99
      ? 3
      : progress > 0.5
      ? 2
      : progress > 0.15
      ? 1
      : 0;

  const stages = [
    "Start",
    "Checkpoint",
    "Current",
    "Destination",
  ];

  return (
    <div
      className="space-y-6"
      data-testid="live-tracking-page"
    >
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Live Vehicle Tracking
        </h1>

        <p className="text-sm text-slate-500">
          Real-time vehicle telemetry and GPS
          tracking across the NER network.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live fleet data...
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCard
            title={mapMode === "real" ? "Live Fleet GPS Map (Geographic)" : "Live Fleet Schematic Map"}
            icon={MapPin}
            testId="tracking-map"
            action={
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  data-testid="map-toggle-real"
                  onClick={() => setMapMode("real")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
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
                  data-testid="map-toggle-schematic"
                  onClick={() => setMapMode("schematic")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    mapMode === "schematic"
                      ? "bg-white text-navy-command shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <span className="text-xs">📐</span>
                  Schematic
                </button>
              </div>
            }
          >
            {mapMode === "real" ? (
              <RealMap
                roads={roads}
                vehicles={vehicles}
                incidents={incidents}
                emergencyMode={emergencyMode}
                height={460}
                selectedVehicleId={selId}
                onSelectVehicle={(id) => setSelId(id)}
              />
            ) : (
              <NERMap
                roads={roads}
                vehicles={vehicles}
                incidents={incidents}
                emergencyMode={emergencyMode}
                height={440}
              />
            )}

            <MapLegend className="mt-3" />
          </DashboardCard>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 card-elev">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              Select Convoy
            </p>

            <div className="space-y-2">
              {vehicles.map((veh) => (
                <button
                  key={veh.id}
                  data-testid={`convoy-${veh.id}`}
                  onClick={() =>
                    setSelId(veh.id)
                  }
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    selId === veh.id
                      ? "border-navy-command bg-navy-command/5"
                      : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {veh.emergency ? (
                      <Siren className="h-4 w-4 text-red-500" />
                    ) : (
                      <Truck className="h-4 w-4 text-navy-command" />
                    )}

                    <span className="font-mono font-semibold">
                      {veh.id}
                    </span>
                  </span>

                  <RiskBadge
                    risk={
                      veh.risk ||
                      "low"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <DashboardCard
            title="Vehicle Telemetry"
            icon={Truck}
            testId="telemetry-card"
          >
            <div className="space-y-2.5 text-sm">
              <Row
                label="Vehicle ID"
                value={v.id}
                mono
              />

              <Row
                label="Goods"
                value={
                  v.goods ||
                  "Essential Goods"
                }
              />

              <Row
                label="Source"
                value={
                  CITIES[v.source]
                    ?.name ||
                  v.source ||
                  "Guwahati"
                }
              />

              <Row
                label="Destination"
                value={
                  CITIES[v.dest]
                    ?.name ||
                  v.dest ||
                  "Shillong"
                }
              />

              <Row
                label="Driver"
                value={
                  v.driver ||
                  "Demo Driver"
                }
              />

              <Row
                label="Trip Status"
                value={
                  v.status ||
                  "UNKNOWN"
                }
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatTile
                testId="track-speed"
                label="Speed"
                value={`${v.speed || 0}`}
                sub="km/h"
                tone="navy"
                icon={Gauge}
              />

              <StatTile
                testId="track-eta"
                label="ETA"
                value={`${v.etaMin || 0}m`}
                sub="remaining"
                tone="safe"
                icon={Clock}
              />
            </div>

            {gpsData?.locations?.length >
              0 && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    GPS Points
                  </span>

                  <span className="font-mono font-semibold text-slate-800">
                    {
                      gpsData.locations
                        .length
                    }
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  GPS tracking active
                </div>
              </div>
            )}

            <Button
              data-testid="sos-btn"
              onClick={() =>
                toast.error(
                  "SOS beacon broadcast — command notified (simulated)."
                )
              }
              className="mt-4 w-full gap-2 bg-red-600 hover:bg-red-700"
            >
              <Siren className="h-4 w-4" />
              Emergency SOS Beacon
            </Button>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard
        title="Trip Progress"
        icon={Navigation}
        testId="trip-progress"
      >
        <Progress
          value={progress * 100}
          className="h-2.5"
        />

        <div className="mt-4 flex justify-between">
          {stages.map((s, i) => (
            <div
              key={s}
              className="flex flex-1 flex-col items-center gap-1 text-center"
            >
              {i <= stageIdx ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300" />
              )}

              <span
                className={cn(
                  "text-xs font-medium",
                  i <= stageIdx
                    ? "text-slate-800"
                    : "text-slate-400"
                )}
              >
                {s}
              </span>

              {i === 0 && (
                <span className="text-[10px] text-slate-400">
                  {CITIES[v.source]
                    ?.name ||
                    "Guwahati"}
                </span>
              )}

              {i === 3 && (
                <span className="text-[10px] text-slate-400">
                  {CITIES[v.dest]
                    ?.name ||
                    "Shillong"}
                </span>
              )}
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-400">
        {label}
      </span>

      <span
        className={
          mono
            ? "font-mono font-semibold text-slate-900"
            : "font-medium text-slate-800"
        }
      >
        {value || "—"}
      </span>
    </div>
  );
}