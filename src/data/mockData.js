// NER SMART — simulated mock data for the prototype.
// NOTE: All data here is SIMULATED for demonstration and is NOT live government data.

export const NER_STATES = [
  "Assam", "Meghalaya", "Arunachal Pradesh", "Manipur",
  "Mizoram", "Nagaland", "Tripura", "Sikkim",
];

// [lat, lon] used by the map projection helper.
export const CITIES = {
  guwahati: { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.14, lon: 91.74, hub: true },
  shillong: { id: "shillong", name: "Shillong", state: "Meghalaya", lat: 25.57, lon: 91.88, hub: true },
  itanagar: { id: "itanagar", name: "Itanagar", state: "Arunachal Pradesh", lat: 27.08, lon: 93.60, hub: true },
  kohima: { id: "kohima", name: "Kohima", state: "Nagaland", lat: 25.67, lon: 94.11, hub: true },
  imphal: { id: "imphal", name: "Imphal", state: "Manipur", lat: 24.82, lon: 93.94, hub: true },
  aizawl: { id: "aizawl", name: "Aizawl", state: "Mizoram", lat: 23.73, lon: 92.72, hub: true },
  agartala: { id: "agartala", name: "Agartala", state: "Tripura", lat: 23.83, lon: 91.28, hub: true },
  gangtok: { id: "gangtok", name: "Gangtok", state: "Sikkim", lat: 27.33, lon: 88.61, hub: true },
  siliguri: { id: "siliguri", name: "Siliguri", state: "West Bengal", lat: 26.72, lon: 88.39, hub: true },
  tawang: { id: "tawang", name: "Tawang", state: "Arunachal Pradesh", lat: 27.58, lon: 91.87 },
  silchar: { id: "silchar", name: "Silchar", state: "Assam", lat: 24.83, lon: 92.78 },
  tezpur: { id: "tezpur", name: "Tezpur", state: "Assam", lat: 26.63, lon: 92.79 },
  dimapur: { id: "dimapur", name: "Dimapur", state: "Nagaland", lat: 25.90, lon: 93.72 },
  dibrugarh: { id: "dibrugarh", name: "Dibrugarh", state: "Assam", lat: 27.47, lon: 94.91 },
  jorhat: { id: "jorhat", name: "Jorhat", state: "Assam", lat: 26.75, lon: 94.20 },
};

export const CITY_LIST = Object.values(CITIES);

// status: open | warning | highrisk | blocked
export const ROADS = [
  { id: "nh27-gs", name: "NH-27 Guwahati–Shillong Corridor", from: "guwahati", to: "shillong", status: "open", riskScore: 18, updated: "4 min ago", grade: "All-Weather", incident: null },
  { id: "nh10-sg", name: "NH-10 Siliguri–Gangtok (Teesta)", from: "siliguri", to: "gangtok", status: "warning", riskScore: 54, updated: "2 min ago", grade: "Monsoon Sensitive", incident: "Teesta river overflow near Sevoke — light caution" },
  { id: "nh29-dk", name: "NH-29 Dimapur–Kohima", from: "dimapur", to: "kohima", status: "highrisk", riskScore: 74, updated: "1 min ago", grade: "Terrain Vulnerable", incident: "Chumukedima mudslip — 78% landslide risk" },
  { id: "nh37-gt", name: "NH-37 Guwahati–Tezpur", from: "guwahati", to: "tezpur", status: "open", riskScore: 22, updated: "6 min ago", grade: "All-Weather", incident: null },
  { id: "nh715-tj", name: "NH-715 Tezpur–Jorhat", from: "tezpur", to: "jorhat", status: "open", riskScore: 28, updated: "9 min ago", grade: "All-Weather", incident: null },
  { id: "nh13-ki", name: "NH-13 Kohima–Imphal", from: "kohima", to: "imphal", status: "warning", riskScore: 48, updated: "3 min ago", grade: "Monsoon Sensitive", incident: "Fog + intermittent rainfall advisory" },
  { id: "nh6-ss", name: "NH-6 Shillong–Silchar (Jaintia Hills)", from: "shillong", to: "silchar", status: "blocked", riskScore: 92, updated: "just now", grade: "Landslide Prone", incident: "Jaintia Hills landslide — 2 lanes blocked" },
  { id: "nh6-sa", name: "NH-6 Silchar–Aizawl", from: "silchar", to: "aizawl", status: "highrisk", riskScore: 68, updated: "5 min ago", grade: "Terrain Vulnerable", incident: "Slope instability after heavy rain" },
  { id: "nh8-as", name: "NH-08 Agartala–Silchar", from: "agartala", to: "silchar", status: "open", riskScore: 31, updated: "7 min ago", grade: "All-Weather", incident: null },
  { id: "nh13-ti", name: "NH-13 Tawang–Itanagar (Sela)", from: "tawang", to: "itanagar", status: "highrisk", riskScore: 71, updated: "2 min ago", grade: "High Altitude", incident: "Sela Pass snow + fog advisory" },
  { id: "nh415-gi", name: "NH-415 Guwahati–Itanagar", from: "guwahati", to: "itanagar", status: "open", riskScore: 26, updated: "8 min ago", grade: "All-Weather", incident: null },
  { id: "nh37-jd", name: "NH-37 Jorhat–Dibrugarh", from: "jorhat", to: "dibrugarh", status: "open", riskScore: 24, updated: "10 min ago", grade: "All-Weather", incident: null },
  { id: "nh6-gs2", name: "NH-06 Guwahati–Silchar (via Meghalaya)", from: "guwahati", to: "silchar", status: "warning", riskScore: 44, updated: "5 min ago", grade: "Monsoon Sensitive", incident: "Waterlogging near Barak valley" },
];

export const GOODS_TYPES = [
  { id: "medicine", label: "Medical & Oxygen Supplies", priority: true },
  { id: "food", label: "Ration & Food Grains", priority: true },
  { id: "agri", label: "Agricultural Produce", priority: false },
  { id: "fuel", label: "Fuel / LPG / Petroleum", priority: true },
  { id: "construction", label: "Construction Material", priority: false },
  { id: "relief", label: "Disaster Relief", priority: true },
  { id: "other", label: "Other", priority: false },
];

export const VEHICLES = [
  { id: "NER-TRUCK-101", goods: "Medical & Oxygen", driver: "R. Baruah", source: "guwahati", dest: "shillong", speed: 38, etaMin: 65, status: "In Transit", risk: "low", progress: 0.34, emergency: false },
  { id: "NER-TRUCK-102", goods: "Medical Supplies", driver: "T. Lyngdoh", source: "guwahati", dest: "itanagar", speed: 42, etaMin: 210, status: "In Transit", risk: "medium", progress: 0.28, emergency: false },
  { id: "NER-TRUCK-103", goods: "Construction Cement", driver: "K. Sangma", source: "shillong", dest: "silchar", speed: 0, etaMin: 320, status: "Delayed", risk: "high", progress: 0.52, emergency: false },
  { id: "NER-TRUCK-104", goods: "Ration & Grains", driver: "L. Ao", source: "dimapur", dest: "kohima", speed: 26, etaMin: 48, status: "Rerouting", risk: "high", progress: 0.61, emergency: false },
  { id: "NER-TRUCK-105", goods: "LPG / Fuel", driver: "S. Chakma", source: "agartala", dest: "silchar", speed: 51, etaMin: 95, status: "On Schedule", risk: "low", progress: 0.45, emergency: false },
  { id: "NER-AMB-201", goods: "Disaster Relief / Ambulance", driver: "NDRF Unit-7", source: "siliguri", dest: "gangtok", speed: 34, etaMin: 72, status: "Priority Transit", risk: "medium", progress: 0.4, emergency: true },
];

export const INCIDENTS_SEED = [
  { id: "NER-HAZ-2026-8942", type: "Landslide", location: "NH-6 Jaintia Hills, Meghalaya", lat: 25.35, lon: 92.35, severity: "critical", reportedBy: "Field Reporter (BRO)", time: "12 min ago", status: "verified", description: "Major landslide blocking 2 lanes near Sonapur. Heavy vehicles stalled.", photo: true },
  { id: "NER-HAZ-2026-8938", type: "Flood", location: "NH-10 Sevoke, Teesta", lat: 26.88, lon: 88.47, severity: "warning", reportedBy: "Citizen App", time: "26 min ago", status: "pending", description: "River water rising close to road shoulder. One-way passable.", photo: true },
  { id: "NER-HAZ-2026-8931", type: "Road Damage", location: "NH-29 Chumukedima, Nagaland", lat: 25.80, lon: 93.78, severity: "critical", reportedBy: "State Patrol", time: "41 min ago", status: "pending", description: "Mudslip eroded carriageway. Alternate via Niuland active.", photo: false },
  { id: "NER-HAZ-2026-8925", type: "Traffic", location: "NH-37 Kaziranga corridor", lat: 26.58, lon: 93.17, severity: "info", reportedBy: "Citizen App", time: "1 hr ago", status: "resolved", description: "Animal corridor crossing — temporary slowdown cleared.", photo: false },
  { id: "NER-HAZ-2026-8919", type: "Bridge Damage", location: "NH-08 Barak Bridge, Silchar", lat: 24.83, lon: 92.78, severity: "warning", reportedBy: "Field Reporter", time: "2 hr ago", status: "verified", description: "Expansion joint strain detected. Load limit advisory issued.", photo: true },
];

export const INCIDENT_TYPES = ["Landslide", "Flood", "Road Damage", "Bridge Damage", "Traffic", "Tree Fall", "Waterlogging", "Other"];

export const PASSABILITY = ["Completely Blocked", "Light 4x4 Only", "Heavy Vehicles Stalled", "One-Way Alternate Open"];

export const WEATHER = {
  rainfall: 12,
  temperature: 24,
  humidity: 88,
  wind: 14,
  warning: "Monsoon Alert Level 3 — heavy rainfall expected across Meghalaya & Barak Valley",
  condition: "Heavy Rain",
};

export const ALERTS_SEED = [
  { id: "al-1", severity: "critical", title: "NH-6 blocked due to landslide", location: "Jaintia Hills, Meghalaya", time: "just now", description: "Route NH-6 Shillong–Silchar blocked by landslide. Two lanes obstructed.", action: "Reroute convoys via NH-08 Agartala–Silchar corridor." },
  { id: "al-2", severity: "warning", title: "Heavy rainfall near selected route", location: "Teesta, NH-10 Sikkim", time: "3 min ago", description: "Rainfall intensity crossing 45mm/hr near Sevoke bridge.", action: "Reduce convoy speed; monitor river level telemetry." },
  { id: "al-3", severity: "info", title: "Expected delay increased by 35 minutes", location: "NH-13 Kohima–Imphal", time: "8 min ago", description: "Fog and slow traffic increasing turnaround time.", action: "Notify depot; adjust delivery SLA." },
  { id: "al-4", severity: "safe", title: "Alternate route available", location: "NH-415 Guwahati–Itanagar", time: "12 min ago", description: "All-weather alternate corridor cleared and recommended.", action: "Dispatch via NH-415 for medical priority cargo." },
  { id: "al-5", severity: "warning", title: "Sela Pass fog + snow advisory", location: "NH-13 Tawang", time: "18 min ago", description: "High-altitude visibility below 50m intermittently.", action: "Hold non-priority convoys until advisory clears." },
];

export const TRIPS = [
  { id: "TRP-4821", source: "Guwahati", dest: "Shillong", goods: "Medical", date: "2026-06-18", route: "NH-27", status: "Delivered", delay: "On time" },
  { id: "TRP-4818", source: "Siliguri", dest: "Gangtok", goods: "Relief", date: "2026-06-17", route: "NH-10", status: "Delivered", delay: "+22 min" },
  { id: "TRP-4810", source: "Dimapur", dest: "Kohima", goods: "Food", date: "2026-06-16", route: "NH-29 (Alt)", status: "Delivered", delay: "+35 min" },
  { id: "TRP-4802", source: "Agartala", dest: "Silchar", goods: "Fuel", date: "2026-06-15", route: "NH-08", status: "Delivered", delay: "On time" },
  { id: "TRP-4795", source: "Shillong", dest: "Silchar", goods: "Construction", date: "2026-06-14", route: "NH-6", status: "Cancelled", delay: "Blocked" },
  { id: "TRP-4788", source: "Guwahati", dest: "Itanagar", goods: "Medical", date: "2026-06-13", route: "NH-415", status: "Delivered", delay: "+12 min" },
];

export const ADMIN_USERS = [
  { id: "USR-1001", name: "Rakesh Baruah", role: "Logistics Operator", region: "Assam", trips: 128, status: "Active" },
  { id: "USR-1002", name: "Teiborlang Lyngdoh", role: "Fleet Driver", region: "Meghalaya", trips: 96, status: "Active" },
  { id: "USR-1003", name: "NDRF Unit-7", role: "Emergency Response", region: "Sikkim", trips: 54, status: "Active" },
  { id: "USR-1004", name: "Lanu Ao", role: "Fleet Driver", region: "Nagaland", trips: 71, status: "On Leave" },
  { id: "USR-1005", name: "Sujata Chakma", role: "Logistics Operator", region: "Tripura", trips: 88, status: "Active" },
];

export const ADMIN_STATS = {
  activeVehicles: 24,
  openRoutes: 186,
  highRiskRoutes: 17,
  blockedRoutes: 6,
  activeAlerts: 9,
  deliveryRate: 94.2,
  monitoredKm: 4820,
  activeConvoys: 182,
};

// Recharts data
export const CHART_DISRUPTIONS = [
  { district: "Jaintia Hills", disruptions: 14 },
  { district: "East Sikkim", disruptions: 11 },
  { district: "Dimapur", disruptions: 9 },
  { district: "Barak Valley", disruptions: 8 },
  { district: "Tawang", disruptions: 7 },
  { district: "Imphal East", disruptions: 5 },
];

export const CHART_INCIDENT_TYPES = [
  { name: "Landslide", value: 38, color: "#EF4444" },
  { name: "Flood", value: 24, color: "#0056B3" },
  { name: "Road Damage", value: 18, color: "#F59E0B" },
  { name: "Bridge Strain", value: 12, color: "#8B5CF6" },
  { name: "Traffic", value: 8, color: "#10B981" },
];

export const CHART_DELAY = [
  { month: "Jan", delay: 22 }, { month: "Feb", delay: 18 }, { month: "Mar", delay: 26 },
  { month: "Apr", delay: 34 }, { month: "May", delay: 48 }, { month: "Jun", delay: 62 },
];

export const CHART_PERFORMANCE = [
  { month: "Jan", delivered: 820, delayed: 60 },
  { month: "Feb", delivered: 910, delayed: 45 },
  { month: "Mar", delivered: 880, delayed: 78 },
  { month: "Apr", delivered: 960, delayed: 92 },
  { month: "May", delivered: 1020, delayed: 140 },
  { month: "Jun", delivered: 1105, delayed: 168 },
];

export const CHART_RISK = [
  { name: "Low Risk", value: 62, color: "#10B981" },
  { name: "Medium Risk", value: 25, color: "#F59E0B" },
  { name: "High Risk", value: 9, color: "#F97316" },
  { name: "Blocked", value: 4, color: "#EF4444" },
];

// Build a plan-route result: 3 options between two cities.
export function buildRouteOptions(sourceId, destId, goodsLabel) {
  const s = CITIES[sourceId];
  const d = CITIES[destId];
  const baseKm = Math.round(haversine(s, d));
  return [
    {
      id: "A",
      label: "Route A — Primary Corridor",
      distance: baseKm,
      etaMin: Math.round(baseKm * 1.6),
      risk: "low",
      riskScore: 22,
      recommended: true,
      weather: "Clear, light drizzle",
      road: "All-weather, good surface",
      delay: "+5 min",
      reason: "Lowest terrain vulnerability, all-weather graded, no active blockages. AI selected for reliable movement of priority cargo.",
      waypoints: [s, d],
    },
    {
      id: "B",
      label: "Route B — Valley Bypass",
      distance: baseKm + 46,
      etaMin: Math.round(baseKm * 1.6) + 55,
      risk: "medium",
      riskScore: 54,
      recommended: false,
      weather: "Moderate rainfall",
      road: "Mixed surface, 2 chokepoints",
      delay: "+40 min",
      reason: "Longer but avoids one high-risk hill segment. Suitable if primary corridor congests.",
      waypoints: [s, d],
    },
    {
      id: "C",
      label: "Route C — Hill Shortcut",
      distance: baseKm - 12,
      etaMin: Math.round(baseKm * 1.4),
      risk: "high",
      riskScore: 78,
      recommended: false,
      weather: "Heavy rainfall + fog",
      road: "Landslide-prone, narrow",
      delay: "High uncertainty",
      reason: "Shortest distance but 78% landslide probability at a known chokepoint. Not advised during monsoon.",
      waypoints: [s, d],
    },
  ];
}

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const DEMO_CREDENTIALS = {
  user: { email: "user@nersmart.demo", password: "user123" },
};

// Step-by-step chokepoint + elevation breakdown for a recommended route (simulated).
export function buildRouteBreakdown(sourceId, destId, route) {
  const s = CITIES[sourceId], d = CITIES[destId];
  const total = route.distance;
  const high = route.risk === "high";
  const med = route.risk === "medium";
  const peak = high ? 2650 : med ? 1850 : 1250;
  const steps = [
    { name: `${s.name} City Exit`, elevation: 320, condition: "Urban arterial · good surface", risk: "low", chokepoint: false, note: "Depot dispatch and city checkpoint." },
    { name: "Foothill Ascent", elevation: Math.round(peak * 0.55), condition: med || high ? "Winding gradient · wet patches" : "Steady climb · sealed", risk: med || high ? "medium" : "low", chokepoint: false, note: "Gradient increases; reduce convoy spacing." },
    { name: high ? "Landslide-Prone Pass" : med ? "Exposed Ridge Pass" : "All-Weather Ridge Pass", elevation: peak, condition: high ? "Narrow, active slope hazard, fog" : med ? "Exposed ridge · gusty winds" : "Graded all-weather pass", risk: route.risk, chokepoint: true, note: high ? "Critical chokepoint — 78% landslide probability during monsoon." : med ? "Single chokepoint — monitor rainfall telemetry." : "Stable all-weather chokepoint, no restrictions." },
    { name: "Valley Descent", elevation: Math.round(peak * 0.4), condition: med || high ? "River-adjacent · possible waterlogging" : "Gentle descent · good surface", risk: med || high ? "medium" : "low", chokepoint: false, note: "Bridge crossing over river tributary." },
    { name: `${d.name} Approach`, elevation: 480, condition: "Peri-urban · good surface", risk: "low", chokepoint: false, note: "Final checkpoint before delivery depot." },
  ];
  const weights = [0.15, 0.25, 0.2, 0.25, 0.15];
  let acc = 0;
  return steps.map((st, i) => {
    const segKm = i === steps.length - 1 ? total - acc : Math.round(total * weights[i]);
    acc += segKm;
    return { ...st, distanceKm: segKm, cumulativeKm: acc, etaMin: Math.round(route.etaMin * weights[i]) };
  });
}
