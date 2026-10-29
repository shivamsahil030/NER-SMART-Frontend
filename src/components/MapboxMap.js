import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CITIES } from "@/data/mockData";
import { STATUS_META, RISK_META } from "@/components/status";

const NER_BOUNDS = [[87.9, 22.8], [95.6, 28.4]];

function vehicleLngLat(v) {
  const s = CITIES[v.source], d = CITIES[v.dest];
  if (!s || !d) return null;
  return [s.lon + (d.lon - s.lon) * v.progress, s.lat + (d.lat - s.lat) * v.progress];
}

// Real Mapbox GL map — rendered only when a token is available. Falls back handled by NERMap.
export default function MapboxMap({ token, roads = [], vehicles = [], incidents = [], height = 520, className, onError }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const vMarkers = useRef({});
  const iMarkers = useRef([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!token || !container.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/light-v11",
      bounds: NER_BOUNDS,
      fitBoundsOptions: { padding: 40 },
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("error", (e) => {
      const msg = e?.error?.message || "";
      if (e?.error?.status === 401 || /access token/i.test(msg)) onError?.();
    });

    map.on("load", () => {
      loadedRef.current = true;
      // Roads as colored lines
      map.addSource("roads", { type: "geojson", data: roadsGeoJSON(roads) });
      map.addLayer({
        id: "roads-line", type: "line", source: "roads",
        layout: { "line-cap": "round" },
        paint: { "line-width": 5, "line-color": ["get", "color"], "line-opacity": 0.9 },
      });
      map.on("click", "roads-line", (e) => {
        const p = e.features[0].properties;
        new mapboxgl.Popup().setLngLat(e.lngLat)
          .setHTML(`<div style="font-family:Outfit,sans-serif"><strong>${p.name}</strong><br/><span style="font-family:monospace;font-size:11px">Status: ${p.status.toUpperCase()} · Risk ${p.riskScore}%</span>${p.incident ? `<br/><span style="font-size:11px;color:#b45309">${p.incident}</span>` : ""}</div>`)
          .addTo(map);
      });
      map.on("mouseenter", "roads-line", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "roads-line", () => { map.getCanvas().style.cursor = ""; });

      // City dots
      map.addSource("cities", { type: "geojson", data: citiesGeoJSON(roads) });
      map.addLayer({ id: "city-dot", type: "circle", source: "cities", paint: { "circle-radius": 4, "circle-color": "#0B192C", "circle-stroke-width": 2, "circle-stroke-color": "#fff" } });
      map.addLayer({ id: "city-label", type: "symbol", source: "cities", layout: { "text-field": ["get", "name"], "text-size": 12, "text-offset": [0, 1.2], "text-anchor": "top" }, paint: { "text-color": "#1e293b", "text-halo-color": "#fff", "text-halo-width": 1.5 } });

      syncVehicles(map, vehicles, vMarkers);
      syncIncidents(map, incidents, iMarkers);
    });

    return () => { map.remove(); mapRef.current = null; loadedRef.current = false; vMarkers.current = {}; iMarkers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Live updates
  useEffect(() => { const m = mapRef.current; if (m && loadedRef.current) { if (m.getSource("roads")) m.getSource("roads").setData(roadsGeoJSON(roads)); } }, [roads]);
  useEffect(() => { const m = mapRef.current; if (m && loadedRef.current) syncVehicles(m, vehicles, vMarkers); }, [vehicles]);
  useEffect(() => { const m = mapRef.current; if (m && loadedRef.current) syncIncidents(m, incidents, iMarkers); }, [incidents]);

  return (
    <div className={className} style={{ position: "relative", height, borderRadius: 12, overflow: "hidden" }}>
      <div ref={container} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", left: 10, top: 10, zIndex: 5, background: "rgba(255,255,255,0.85)", padding: "3px 8px", borderRadius: 6, fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "#475569" }}>
        Live Mapbox · NER Network
      </div>
    </div>
  );
}

function roadsGeoJSON(roads) {
  return {
    type: "FeatureCollection",
    features: roads.map((r) => {
      const a = CITIES[r.from], b = CITIES[r.to];
      return {
        type: "Feature",
        properties: { name: r.name, status: r.status, riskScore: r.riskScore, incident: r.incident || "", color: (STATUS_META[r.status] || STATUS_META.open).color },
        geometry: { type: "LineString", coordinates: [[a.lon, a.lat], [b.lon, b.lat]] },
      };
    }),
  };
}
function citiesGeoJSON(roads) {
  const ids = new Set();
  roads.forEach((r) => { ids.add(r.from); ids.add(r.to); });
  return {
    type: "FeatureCollection",
    features: Array.from(ids).map((id) => ({ type: "Feature", properties: { name: CITIES[id].name }, geometry: { type: "Point", coordinates: [CITIES[id].lon, CITIES[id].lat] } })),
  };
}
function makeEl(color, label, pulse) {
  const el = document.createElement("div");
  el.style.cssText = `width:20px;height:20px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.3);display:grid;place-items:center;color:#fff;font:700 10px/1 'JetBrains Mono',monospace;${pulse ? "animation:pulse 1.6s infinite" : ""}`;
  el.textContent = label;
  return el;
}
function syncVehicles(map, vehicles, ref) {
  vehicles.forEach((v) => {
    const ll = vehicleLngLat(v);
    if (!ll) return;
    const color = v.emergency ? "#EF4444" : (RISK_META[v.risk]?.color || "#0056B3");
    if (ref.current[v.id]) { ref.current[v.id].setLngLat(ll); }
    else {
      const m = new mapboxgl.Marker({ element: makeEl(color, v.emergency ? "+" : "T", v.emergency) }).setLngLat(ll)
        .setPopup(new mapboxgl.Popup({ offset: 16 }).setHTML(`<strong>${v.id}</strong><br/><span style="font-size:11px">${v.goods}<br/>${CITIES[v.source]?.name} → ${CITIES[v.dest]?.name}<br/>ETA ${v.etaMin} min · ${v.status}</span>`))
        .addTo(map);
      ref.current[v.id] = m;
    }
  });
}
function syncIncidents(map, incidents, ref) {
  ref.current.forEach((m) => m.remove());
  ref.current = incidents.map((inc) => {
    const color = inc.severity === "critical" ? "#EF4444" : inc.severity === "warning" ? "#F59E0B" : "#0056B3";
    return new mapboxgl.Marker({ element: makeEl(color, "!") }).setLngLat([inc.lon, inc.lat])
      .setPopup(new mapboxgl.Popup({ offset: 16 }).setHTML(`<strong>${inc.type}</strong><br/><span style="font-size:11px">${inc.location}<br/>${inc.description}</span>`))
      .addTo(map);
  });
}
