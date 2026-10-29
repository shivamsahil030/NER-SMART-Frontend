import React from "react";
import { cn } from "@/lib/utils";
import { RISK_META } from "@/components/status";
import {
  Route,
  Clock,
  Ruler,
  CheckCircle2,
  CloudRain,
  TrafficCone,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function RouteCard({
  route,
  selected,
  onSelect,
  onDispatch,
  onOpenGoogleMaps,
  googleMapsUrl,
  testId,
}) {
  // Safely handle risk level coming from backend
  const riskKey = String(
    route?.risk || "medium"
  ).toLowerCase();

  const m =
    RISK_META[riskKey] ||
    RISK_META.medium ||
    RISK_META.MEDIUM || {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
      color: "#64748b",
      label: riskKey,
    };

  // Safely handle ETA
  const etaMin = Number(
    route?.etaMin ?? 0
  );

  const hrs = Math.floor(
    etaMin / 60
  );

  const mins = etaMin % 60;

  return (
    <div
      data-testid={testId}
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-xl border bg-white p-4 card-elev transition-all",
        selected
          ? "border-navy-command ring-2 ring-navy-command/30"
          : "border-slate-200",
        route?.recommended &&
          "border-l-4 border-l-emerald-500"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-command/10 text-navy-command">
            <Route className="h-4 w-4" />
          </span>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 font-head">
              {route?.label ||
                "Route"}
            </h4>

            {route?.recommended && (
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-emerald-700">
                <Sparkles className="h-3 w-3" />
                AI Recommended
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold uppercase",
              m.bg,
              m.text,
              m.border
            )}
          >
            Risk: {m.label}
          </span>

          {(onOpenGoogleMaps || googleMapsUrl) && (
            <button
              type="button"
              title="Open route in Google Maps"
              data-testid={`gmaps-icon-btn-${route?.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenGoogleMaps) {
                  onOpenGoogleMaps(route);
                } else if (googleMapsUrl) {
                  window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
                }
              }}
              className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-xs"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Metric
          icon={Ruler}
          label="Distance"
          value={`${route?.distance ?? 0} km`}
        />

        <Metric
          icon={Clock}
          label="ETA"
          value={`${hrs}h ${mins}m`}
        />

        <Metric
          icon={TrafficCone}
          label="Delay"
          value={route?.delay || "—"}
        />
      </div>

      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">
            Risk Score
          </span>

          <span
            className="font-mono font-bold"
            style={{
              color: m.color,
            }}
          >
            {route?.riskScore ?? 0}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <CloudRain className="h-3 w-3" />
            Weather
          </span>

          <span className="text-slate-700">
            {route?.weather ||
              "No data"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">
            Road condition
          </span>

          <span className="text-slate-700">
            {route?.road ||
              "No data"}
          </span>
        </div>
      </div>

      <p className="mt-2 rounded-md bg-slate-50 p-2 text-xs text-slate-600">
        {route?.reason ||
          "AI analysed this route based on available risk data."}
      </p>

      {selected && (
        <div className="mt-3 space-y-2">
          <Button
            data-testid={`dispatch-btn-${route?.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDispatch?.(route);
            }}
            className="w-full bg-navy-command hover:bg-navy text-white font-medium shadow-sm transition-all"
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />

            Dispatch Convoy via{" "}
            {(route?.label || "Route")
              .split("—")[0]
              .trim()}
          </Button>

          {(onOpenGoogleMaps || googleMapsUrl) && (
            <Button
              type="button"
              variant="outline"
              data-testid={`gmaps-btn-${route?.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenGoogleMaps) {
                  onOpenGoogleMaps(route);
                } else if (googleMapsUrl) {
                  window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
                }
              }}
              className="w-full border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-navy text-xs font-medium"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
              Open Route in Google Maps
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-lg bg-slate-50 py-2">
      <Icon className="mx-auto h-3.5 w-3.5 text-slate-400" />

      <p className="mt-1 font-mono text-sm font-bold text-slate-900">
        {value}
      </p>

      <p className="text-[9px] uppercase text-slate-400">
        {label}
      </p>
    </div>
  );
}