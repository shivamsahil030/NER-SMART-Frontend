import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CITIES } from "@/data/mockData";
import { STATUS_META, RISK_META } from "@/components/status";
import { cn } from "@/lib/utils";
import { RotateCcw, ShieldAlert } from "lucide-react";

// North Eastern Region bounding coordinates
const NER_CENTER = [26.14, 92.5];
const NER_BOUNDS = [
  [22.8, 88.2],
  [28.2, 95.8],
];

const TILE_PROVIDERS = {
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
    maxZoom: 18,
    attribution: '&copy; Esri &mdash; Earthstar Geographics',
  },
  topo: {
    name: "Terrain Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    subdomains: "abc",
    maxZoom: 18,
    attribution: '&copy; Esri &mdash; USGS, NOAA',
  },
};

function getVehicleLatLng(v) {
  if (!v) return null;

  // Direct lat/lon if available
  if (v.lat && v.lon) {
    return [Number(v.lat), Number(v.lon)];
  }

  // GeoJSON Point: [lon, lat]
  if (v.currentLocation?.coordinates && Array.isArray(v.currentLocation.coordinates)) {
    return [v.currentLocation.coordinates[1], v.currentLocation.coordinates[0]];
  }
  if (Array.isArray(v.location) && v.location.length >= 2) {
    return [v.location[1], v.location[0]];
  }

  // Interpolated along route between source and dest
  const s = CITIES[v.source] || CITIES.guwahati;
  const d = CITIES[v.dest] || CITIES.shillong;
  if (!s || !d) return null;

  const prog = Math.min(1, Math.max(0, Number(v.progress || 0)));
  const lat = s.lat + (d.lat - s.lat) * prog;
  const lon = s.lon + (d.lon - s.lon) * prog;
  return [lat, lon];
}

export default function RealMap({
  roads = [],
  vehicles = [],
  incidents = [],
  routeOverlay = null,
  emergencyMode = false,
  height = 460,
  className,
  selectedVehicleId = null,
  onSelectVehicle,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const vehicleMarkersRef = useRef({});
  const layersRef = useRef({
    roads: null,
    cities: null,
    vehicles: null,
    incidents: null,
    overlay: null,
  });

  const [activeTile, setActiveTile] = useState("osm");
  const [mapReady, setMapReady] = useState(false);

  // ----------------------------------------------------
  // Initialize Leaflet Map
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: NER_CENTER,
      zoom: 7,
      minZoom: 6,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add Zoom Control at top-right (Leaflet requires "topright" without hyphen)
    L.control.zoom({ position: "topright" }).addTo(map);

    // Initial Base Tile Layer
    const provider = TILE_PROVIDERS[activeTile];
    tileLayerRef.current = L.tileLayer(provider.url, {
      subdomains: provider.subdomains,
      maxZoom: provider.maxZoom,
    }).addTo(map);

    // Create & add layer groups to map
    layersRef.current = {
      roads: L.layerGroup().addTo(map),
      cities: L.layerGroup().addTo(map),
      vehicles: L.layerGroup().addTo(map),
      incidents: L.layerGroup().addTo(map),
      overlay: L.layerGroup().addTo(map),
    };

    setMapReady(true);
    map.fitBounds(NER_BOUNDS, { padding: [30, 30] });

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      setMapReady(false);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------------
  // Switch Tile Provider
  // ----------------------------------------------------
  const changeTile = (key) => {
    setActiveTile(key);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[key];
    tileLayerRef.current = L.tileLayer(provider.url, {
      subdomains: provider.subdomains,
      maxZoom: provider.maxZoom,
    }).addTo(map);
    tileLayerRef.current.bringToBack();
  };

  const resetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.fitBounds(NER_BOUNDS, { padding: [35, 35], animate: true });
    }
  };

  // ----------------------------------------------------
  // Sync Roads & Cities
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersRef.current.roads || !layersRef.current.cities) return;

    const roadGroup = layersRef.current.roads;
    const cityGroup = layersRef.current.cities;
    roadGroup.clearLayers();
    cityGroup.clearLayers();

    // Render Road Polylines
    roads.forEach((r) => {
      const a = CITIES[r.from];
      const b = CITIES[r.to];
      if (!a || !b) return;

      const meta = STATUS_META[r.status] || STATUS_META.open;
      const latlngs = [
        [a.lat, a.lon],
        [b.lat, b.lon],
      ];

      const polyline = L.polyline(latlngs, {
        color: meta.color,
        weight: r.status === "blocked" ? 5 : 4,
        opacity: 0.9,
        dashArray: r.status === "warning" ? "6, 6" : undefined,
      });

      const popupContent = `
        <div style="font-family: Outfit, sans-serif; font-size: 13px; min-width: 200px; padding: 2px;">
          <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 3px;">${r.name || r.id}</div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 999px; background: ${meta.color}15; color: ${meta.color}; font-weight: 700; font-size: 10px; font-family: monospace; text-transform: uppercase;">
            ${r.status.toUpperCase()} &bull; RISK ${r.riskScore || r.risk_score || 20}%
          </div>
          <div style="color: #64748b; font-size: 11px; margin-top: 5px;">
            <strong>Corridor:</strong> ${a.name} &rarr; ${b.name}
          </div>
          ${r.passability ? `<div style="color: #475569; font-size: 11px; margin-top: 2px;"><strong>Passability:</strong> ${r.passability}</div>` : ""}
          ${r.incident ? `<div style="color: #b45309; font-size: 11px; background: #fef3c7; padding: 4px 6px; border-radius: 4px; margin-top: 5px;">&excl; ${r.incident}</div>` : ""}
        </div>
      `;

      polyline.bindPopup(popupContent);
      roadGroup.addLayer(polyline);
    });

    // Render Hub & City Markers
    Object.values(CITIES).forEach((city) => {
      const isHub = city.hub;
      const marker = L.circleMarker([city.lat, city.lon], {
        radius: isHub ? 6 : 4,
        fillColor: isHub ? "#0056B3" : "#1e293b",
        color: "#ffffff",
        weight: 2,
        fillOpacity: 1,
      });

      marker.bindTooltip(`<strong>${city.name}</strong>${isHub ? " (Hub)" : ""}`, {
        permanent: false,
        direction: "top",
        offset: [0, -6],
        className: "custom-map-tooltip",
      });

      cityGroup.addLayer(marker);
    });
  }, [mapReady, roads]);

  // ----------------------------------------------------
  // Sync Live Vehicles
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersRef.current.vehicles) return;

    const vGroup = layersRef.current.vehicles;
    vGroup.clearLayers();
    vehicleMarkersRef.current = {};

    vehicles.forEach((v) => {
      const latlng = getVehicleLatLng(v);
      if (!latlng) return;

      const isEmergency = v.emergency || emergencyMode;
      const riskMeta = RISK_META[v.risk] || RISK_META.low;
      const markerColor = isEmergency ? "#EF4444" : riskMeta.color;

      // Custom divIcon with pulsing radar ring
      const customIcon = L.divIcon({
        className: "custom-vehicle-marker",
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: ${markerColor}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${markerColor}; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px; font-weight: 700; font-family: monospace;">
              ${isEmergency ? "!" : "T"}
            </div>
            <div style="position: absolute; top: -14px; background: rgba(15,23,42,0.85); color: #ffffff; font-size: 9px; font-family: monospace; padding: 1px 4px; border-radius: 3px; white-space: nowrap; font-weight: 600;">
              ${(v.speed ?? v.currentSpeedKmph ?? 0)} km/h
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const sName = CITIES[v.source]?.name || v.source || "Guwahati";
      const dName = CITIES[v.dest]?.name || v.dest || "Shillong";
      const progressPct = Math.round(Number(v.progress || 0) * 100);

      const marker = L.marker(latlng, { icon: customIcon });

      const popupContent = `
        <div style="font-family: Outfit, sans-serif; min-width: 220px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-family: monospace; font-weight: 700; font-size: 13px; color: #0056B3;">${v.id}</span>
            <span style="font-size: 10px; font-family: monospace; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: ${markerColor}20; color: ${markerColor}; text-transform: uppercase;">
              ${v.status || "In Transit"}
            </span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 2px;">${v.goods || "Essential Cargo"}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${sName} &rarr; ${dName}</div>
          <div style="margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-bottom: 2px;">
              <span>Progress</span>
              <span>${progressPct}%</span>
            </div>
            <div style="height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden;">
              <div style="height: 100%; width: ${progressPct}%; background: #0056B3;"></div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: monospace; color: #475569; background: #f8fafc; padding: 4px 6px; border-radius: 4px;">
            <span>Speed: <strong>${v.speed ?? v.currentSpeedKmph ?? 0} km/h</strong></span>
            <span>ETA: <strong>${v.etaMin ?? 60}m</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => onSelectVehicle?.(v.id));
      vehicleMarkersRef.current[v.id] = marker;
      vGroup.addLayer(marker);
    });
  }, [mapReady, vehicles, emergencyMode, onSelectVehicle]);

  // Smoothly pan & open popup when selected vehicle changes
  useEffect(() => {
    if (!mapReady || !selectedVehicleId || !mapInstanceRef.current) return;
    const targetVeh = vehicles.find((x) => x.id === selectedVehicleId);
    if (!targetVeh) return;
    const latlng = getVehicleLatLng(targetVeh);
    if (latlng) {
      mapInstanceRef.current.panTo(latlng, { animate: true, duration: 0.6 });
      const m = vehicleMarkersRef.current[selectedVehicleId];
      if (m && !m.isPopupOpen()) {
        m.openPopup();
      }
    }
  }, [mapReady, selectedVehicleId, vehicles]);

  // ----------------------------------------------------
  // Sync Incidents / Hazards
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersRef.current.incidents) return;

    const iGroup = layersRef.current.incidents;
    iGroup.clearLayers();

    incidents.forEach((inc) => {
      if (!inc.lat || !inc.lon) return;

      const isCritical = inc.severity === "critical" || inc.severity === "HIGH";
      const color = isCritical ? "#EF4444" : "#F59E0B";

      const hazardIcon = L.divIcon({
        className: "custom-hazard-marker",
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: ${color}; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 12px; font-weight: 900;">
              !
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([inc.lat, inc.lon], { icon: hazardIcon });

      const popupContent = `
        <div style="font-family: Outfit, sans-serif; min-width: 200px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 4px; color: ${color}; font-weight: 700; font-size: 13px; margin-bottom: 2px;">
            <span>&excl;</span> ${inc.type || "Hazard Alert"}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">${inc.location || "North Eastern Sector"}</div>
          <p style="font-size: 11px; color: #334155; margin: 4px 0;">${inc.description || "Reported terrain disruption."}</p>
          ${inc.passability ? `<div style="font-size: 10px; font-family: monospace; color: #b45309; background: #fef3c7; padding: 3px 6px; border-radius: 4px;">Passability: ${inc.passability}</div>` : ""}
        </div>
      `;

      marker.bindPopup(popupContent);
      iGroup.addLayer(marker);
    });
  }, [mapReady, incidents]);

  // ----------------------------------------------------
  // Sync Route Overlay
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layersRef.current.overlay) return;

    const overlayGroup = layersRef.current.overlay;
    overlayGroup.clearLayers();

    if (routeOverlay && Array.isArray(routeOverlay)) {
      routeOverlay.forEach((seg) => {
        if (!seg.from || !seg.to) return;
        const line = L.polyline(
          [
            [seg.from.lat, seg.from.lon],
            [seg.to.lat, seg.to.lon],
          ],
          {
            color: "#0056B3",
            weight: 6,
            opacity: 0.85,
            dashArray: "8, 8",
          }
        );
        overlayGroup.addLayer(line);
      });
    }
  }, [mapReady, routeOverlay]);

  return (
    <div
      data-testid="real-geographic-map"
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-inner",
        emergencyMode && "ring-2 ring-red-500",
        className
      )}
      style={{ height }}
    >
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />

      {/* Top Banner Badge */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Live Real Geographic Map &bull; North East Region
      </div>

      {/* Map Controls: Reset & Style Switcher */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur">
        {Object.entries(TILE_PROVIDERS).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => changeTile(key)}
            className={cn(
              "rounded-md px-2.5 py-1 text-[10px] font-mono font-semibold transition-colors",
              activeTile === key
                ? "bg-navy-command text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {provider.name}
          </button>
        ))}

        <div className="mx-1 h-3.5 w-px bg-slate-200" />

        <button
          onClick={resetView}
          title="Reset to Full NER View"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono font-semibold text-slate-600 hover:bg-slate-100"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {emergencyMode && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
          <ShieldAlert className="h-4 w-4" />
          Emergency Priority Routing Active
        </div>
      )}
    </div>
  );
}
