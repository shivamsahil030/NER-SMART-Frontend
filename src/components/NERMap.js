import React, { useMemo, useState } from "react";
import { CITIES } from "@/data/mockData";
import { STATUS_META, RISK_META } from "@/components/status";
import {
  Truck,
  AlertTriangle,
  X,
  MapPin,
  Ambulance,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MapboxMap from "@/components/MapboxMap";

export function getMapboxToken() {
  return (
    localStorage.getItem("ner_mapbox_token") ||
    process.env.REACT_APP_MAPBOX_TOKEN ||
    ""
  );
}

const VB_W = 1000;
const VB_H = 760;

const LON_MIN = 87.9;
const LON_MAX = 95.6;
const LAT_MIN = 22.8;
const LAT_MAX = 28.4;

const validCoordinate = (lat, lon) => {
  return (
    Number.isFinite(Number(lat)) &&
    Number.isFinite(Number(lon))
  );
};

const project = (lat, lon) => ({
  x:
    ((Number(lon) - LON_MIN) /
      (LON_MAX - LON_MIN)) *
    VB_W,

  y:
    ((LAT_MAX - Number(lat)) /
      (LAT_MAX - LAT_MIN)) *
    VB_H,
});

function vehiclePos(v) {
  if (!v) return null;

  // Backend format: location: [longitude, latitude]
  if (
    Array.isArray(v.location) &&
    v.location.length >= 2 &&
    validCoordinate(v.location[1], v.location[0])
  ) {
    const p = project(v.location[1], v.location[0]);

    return {
      x: p.x,
      y: p.y,
      s: CITIES[v.source] || null,
      d: CITIES[v.dest] || null,
    };
  }

  // Frontend/mock format
  const s = CITIES[v.source];
  const d = CITIES[v.dest];

  if (!s || !d) return null;

  if (
    !validCoordinate(s.lat, s.lon) ||
    !validCoordinate(d.lat, d.lon)
  ) {
    return null;
  }

  const ps = project(s.lat, s.lon);
  const pd = project(d.lat, d.lon);

  const progress = Number.isFinite(Number(v.progress))
    ? Number(v.progress)
    : 0;

  return {
    x: ps.x + (pd.x - ps.x) * progress,
    y: ps.y + (pd.y - ps.y) * progress,
    s,
    d,
  };
}

export default function NERMap({
  roads = [],
  vehicles = [],
  incidents = [],
  weatherMarkers = [],
  routeOverlay = null,
  emergencyMode = false,
  height = 520,
  className,
}) {
  const [selRoad, setSelRoad] = useState(null);
  const [selVehicle, setSelVehicle] = useState(null);
  const [selIncident, setSelIncident] = useState(null);
  const [mapboxFailed, setMapboxFailed] = useState(false);

  const roadGeoms = useMemo(() => {
    return roads
      .map((r) => {
        if (!r) return null;

        const from = r.from;
        const to = r.to;

        const aCity = CITIES[from];
        const bCity = CITIES[to];

        if (!aCity || !bCity) {
          return null;
        }

        if (
          !validCoordinate(aCity.lat, aCity.lon) ||
          !validCoordinate(bCity.lat, bCity.lon)
        ) {
          return null;
        }

        return {
          ...r,
          id: r.id || r.road_id,
          name: r.name || r.road_name || r.road_id,
          a: project(aCity.lat, aCity.lon),
          b: project(bCity.lat, bCity.lon),
          an: aCity,
          bn: bCity,
        };
      })
      .filter(Boolean);
  }, [roads]);

  const cityNodes = useMemo(() => {
    const ids = new Set();

    roads.forEach((r) => {
      if (r?.from && CITIES[r.from]) {
        ids.add(r.from);
      }

      if (r?.to && CITIES[r.to]) {
        ids.add(r.to);
      }
    });

    return Array.from(ids)
      .map((id) => {
        const city = CITIES[id];

        if (!city) return null;

        if (
          !validCoordinate(city.lat, city.lon)
        ) {
          return null;
        }

        return {
          ...city,
          id,
          ...project(city.lat, city.lon),
        };
      })
      .filter(Boolean);
  }, [roads]);

  const clearSel = () => {
    setSelRoad(null);
    setSelVehicle(null);
    setSelIncident(null);
  };

  const mbToken = getMapboxToken();

  if (mbToken && !mapboxFailed) {
    return (
      <MapboxMap
        token={mbToken}
        roads={roads}
        vehicles={vehicles}
        incidents={incidents}
        height={height}
        className={className}
        onError={() => {
          setMapboxFailed(true);

          toast.error(
            "Mapbox token invalid — showing built-in map."
          );
        }}
      />
    );
  }

  return (
    <div
      data-testid="ner-map"
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-slate-200 bg-[#eef4fb]",
        emergencyMode && "ring-2 ring-red-400",
        className
      )}
      style={{ height }}
    >
      <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-md bg-white/85 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 backdrop-blur">
        Simulated NER Network · Not live gov data
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        onClick={clearSel}
      >
        <defs>
          <linearGradient
            id="mapbg"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#eaf2fb"
            />

            <stop
              offset="100%"
              stopColor="#dde9f6"
            />
          </linearGradient>

          <pattern
            id="grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M28 0H0V28"
              fill="none"
              stroke="#c7d7ea"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>

        <rect
          width={VB_W}
          height={VB_H}
          fill="url(#mapbg)"
        />

        <rect
          width={VB_W}
          height={VB_H}
          fill="url(#grid)"
        />

        <g opacity="0.5">
          <ellipse
            cx="520"
            cy="300"
            rx="360"
            ry="230"
            fill="#dbe9d6"
            opacity="0.5"
          />

          <ellipse
            cx="760"
            cy="220"
            rx="200"
            ry="160"
            fill="#cfe0d0"
            opacity="0.5"
          />

          <path
            d="M60 520 Q 300 470 560 540 T 960 520"
            fill="none"
            stroke="#9cc0e8"
            strokeWidth="6"
            opacity="0.5"
          />
        </g>

        {Array.isArray(routeOverlay) &&
          routeOverlay.map((seg, i) => {
            if (
              !seg?.from ||
              !seg?.to ||
              !validCoordinate(
                seg.from.lat,
                seg.from.lon
              ) ||
              !validCoordinate(
                seg.to.lat,
                seg.to.lon
              )
            ) {
              return null;
            }

            const a = project(
              seg.from.lat,
              seg.from.lon
            );

            const b = project(
              seg.to.lat,
              seg.to.lon
            );

            const col =
              RISK_META?.[seg.risk]?.color ||
              "#0056B3";

            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={col}
                strokeWidth="8"
                strokeLinecap="round"
                className="dashed-move"
                opacity="0.9"
              />
            );
          })}

        {roadGeoms.map((r) => {
          const m =
            STATUS_META?.[r.status] || {
              color: "#0056B3",
            };

          const active =
            selRoad?.id === r.id;

          return (
            <g
              key={r.id}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();

                clearSel();
                setSelRoad(r);
              }}
            >
              <line
                x1={r.a.x}
                y1={r.a.y}
                x2={r.b.x}
                y2={r.b.y}
                stroke={m.color}
                strokeWidth={active ? 9 : 6}
                strokeLinecap="round"
                opacity={active ? 1 : 0.9}
              />

              {r.status === "blocked" && (
                <line
                  x1={r.a.x}
                  y1={r.a.y}
                  x2={r.b.x}
                  y2={r.b.y}
                  stroke={m.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  opacity="0.18"
                />
              )}

              <line
                x1={r.a.x}
                y1={r.a.y}
                x2={r.b.x}
                y2={r.b.y}
                stroke="transparent"
                strokeWidth="20"
              />
            </g>
          );
        })}

        {cityNodes.map((c) => (
          <g key={c.id}>
            <circle
              cx={c.x}
              cy={c.y}
              r={c.hub ? 6 : 4}
              fill="#0B192C"
              stroke="#fff"
              strokeWidth="2"
            />

            <text
              x={c.x + 9}
              y={c.y + 4}
              fontSize="13"
              fontWeight="600"
              fill="#1e293b"
              style={{
                fontFamily:
                  "Outfit, sans-serif",
              }}
            >
              {c.name}
            </text>
          </g>
        ))}

        {incidents.map((inc, i) => {
          if (
            !inc ||
            !validCoordinate(inc.lat, inc.lon)
          ) {
            return null;
          }

          const p = project(
            inc.lat,
            inc.lon
          );

          const col =
            inc.severity === "critical"
              ? "#EF4444"
              : inc.severity === "warning"
              ? "#F59E0B"
              : "#0056B3";

          return (
            <g
              key={inc.id || i}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();

                clearSel();
                setSelIncident(inc);
              }}
            >
              {inc.severity === "critical" && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  fill={col}
                  className="pulse-ring"
                  opacity="0.5"
                />
              )}

              <polygon
                points={`
                  ${p.x},${p.y - 9}
                  ${p.x - 8},${p.y + 6}
                  ${p.x + 8},${p.y + 6}
                `}
                fill={col}
                stroke="#fff"
                strokeWidth="1.5"
              />

              <text
                x={p.x}
                y={p.y + 3}
                fontSize="9"
                fontWeight="800"
                fill="#fff"
                textAnchor="middle"
              >
                !
              </text>
            </g>
          );
        })}

        {weatherMarkers.map((w, i) => {
          if (
            !w ||
            !validCoordinate(w.lat, w.lon)
          ) {
            return null;
          }

          const p = project(
            w.lat,
            w.lon
          );

          return (
            <g
              key={`w-${w.lat}-${w.lon}-${i}`}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="#0056B3"
                opacity="0.12"
              />

              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#0056B3"
              />
            </g>
          );
        })}

        {vehicles.map((v, i) => {
          const p = vehiclePos(v);

          if (!p) return null;

          const col =
            v.emergency
              ? "#EF4444"
              : RISK_META?.[v.risk]?.color ||
                "#0056B3";

          const active =
            selVehicle?.id === v.id;

          return (
            <g
              key={v.id || i}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();

                clearSel();
                setSelVehicle(v);
              }}
              transform={`translate(${p.x}, ${p.y})`}
            >
              <circle
                r="13"
                fill={col}
                opacity="0.18"
                className={
                  v.emergency
                    ? "pulse-ring"
                    : ""
                }
              />

              <circle
                r={active ? 11 : 9}
                fill={col}
                stroke="#fff"
                strokeWidth="2.5"
              />

              <text
                y="4"
                fontSize="10"
                fontWeight="800"
                fill="#fff"
                textAnchor="middle"
                style={{
                  fontFamily:
                    "JetBrains Mono, monospace",
                }}
              >
                {v.emergency ? "+" : "T"}
              </text>
            </g>
          );
        })}
      </svg>

      {selRoad && (
        <MapPopover
          onClose={clearSel}
          title={
            selRoad.name ||
            selRoad.road_name ||
            selRoad.road_id ||
            "Road"
          }
          testId="map-road-popover"
        >
          <Row label="Status">
            <StatusPill
              status={selRoad.status}
            />
          </Row>

          <Row label="Risk Score">
            <span className="font-mono font-bold">
              {selRoad.riskScore ??
                selRoad.risk_score ??
                0}
              %
            </span>
          </Row>

          <Row label="Grade">
            {selRoad.grade || "N/A"}
          </Row>

          <Row label="Updated">
            {selRoad.updated || "Recently"}
          </Row>

          {selRoad.incident && (
            <div className="mt-2 rounded-md bg-slate-50 p-2 text-xs text-slate-600">
              <AlertTriangle className="mr-1 inline h-3 w-3 text-amber-500" />
              {selRoad.incident}
            </div>
          )}
        </MapPopover>
      )}

      {selVehicle && (
        <MapPopover
          onClose={clearSel}
          title={selVehicle.id || "Vehicle"}
          testId="map-vehicle-popover"
          icon={
            selVehicle.emergency
              ? Ambulance
              : Truck
          }
        >
          <Row label="Goods">
            {selVehicle.goods ||
              selVehicle.vehicle_type ||
              "Cargo"}
          </Row>

          <Row label="From → To">
            {CITIES[selVehicle.source]?.name ||
              "Unknown"}{" "}
            →{" "}
            {CITIES[selVehicle.dest]?.name ||
              "Unknown"}
          </Row>

          <Row label="Speed">
            <span className="font-mono">
              {selVehicle.speed ??
                selVehicle.currentSpeedKmph ??
                0}{" "}
              km/h
            </span>
          </Row>

          <Row label="ETA">
            <span className="font-mono">
              {selVehicle.etaMin ?? 0} min
            </span>
          </Row>

          <Row label="Status">
            {selVehicle.status ||
              "UNKNOWN"}
          </Row>
        </MapPopover>
      )}

      {selIncident && (
        <MapPopover
          onClose={clearSel}
          title={
            selIncident.type ||
            "Incident"
          }
          testId="map-incident-popover"
          icon={AlertTriangle}
        >
          <Row label="Location">
            {selIncident.location ||
              "Unknown"}
          </Row>

          <Row
            label="Severity"
            className="uppercase font-semibold"
          >
            {selIncident.severity ||
              "Unknown"}
          </Row>

          <Row label="Status">
            {selIncident.status ||
              "Unknown"}
          </Row>

          <div className="mt-2 rounded-md bg-slate-50 p-2 text-xs text-slate-600">
            {selIncident.description ||
              "No description available."}
          </div>
        </MapPopover>
      )}
    </div>
  );
}

function MapPopover({
  title,
  icon: Icon = MapPin,
  children,
  onClose,
  testId,
}) {
  return (
    <div
      data-testid={testId}
      className="absolute right-3 top-12 z-30 w-64 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 pr-1">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-navy-command/10 text-navy-command">
            <Icon className="h-4 w-4" />
          </span>

          <p className="text-sm font-semibold leading-tight text-slate-900 font-head">
            {title}
          </p>
        </div>

        <button
          data-testid="map-popover-close"
          onClick={onClose}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1.5 text-xs">
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  className,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-400">
        {label}
      </span>

      <span
        className={cn(
          "text-right text-slate-800",
          className
        )}
      >
        {children}
      </span>
    </div>
  );
}

function StatusPill({ status }) {
  const m =
    STATUS_META?.[status] || {
      bg: "bg-slate-100",
      text: "text-slate-600",
      label: status || "Unknown",
    };

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold uppercase",
        m.bg,
        m.text
      )}
    >
      {m.label}
    </span>
  );
}