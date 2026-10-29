import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ROADS as ROADS_SEED, VEHICLES as VEHICLES_SEED, INCIDENTS_SEED,
  ALERTS_SEED, WEATHER, DEMO_CREDENTIALS,
} from "@/data/mockData";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const AUTH_KEY = "ner_smart_auth";
const STATE_KEY = "ner_smart_state";

function loadState() {
  try { return JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch { return {}; }
}

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
  });
  const [roads, setRoads] = useState(() => loadState().roads || ROADS_SEED);
  const [vehicles, setVehicles] = useState(VEHICLES_SEED);
  const [incidents, setIncidents] = useState(() => loadState().incidents || INCIDENTS_SEED);
  const [alerts, setAlerts] = useState(() => loadState().alerts || ALERTS_SEED);
  const [weather, setWeather] = useState(WEATHER);
  const [emergencyMode, setEmergencyMode] = useState(() => loadState().emergencyMode || false);
  const [tick, setTick] = useState(0);

  // Persist the demo simulation slice so road blocks, reports & verifications survive a refresh.
  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify({ roads, incidents, alerts, emergencyMode }));
  }, [roads, incidents, alerts, emergencyMode]);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STATE_KEY);
    setRoads(ROADS_SEED);
    setIncidents(INCIDENTS_SEED);
    setAlerts(ALERTS_SEED);
    setEmergencyMode(false);
  }, []);

  // login/logout
  const login = useCallback((role, email, password) => {
    const cred = DEMO_CREDENTIALS[role];
    if (email?.trim().toLowerCase() === cred.email && password === cred.password) {
      const session = { role, email: cred.email, name: role === "admin" ? "State Command Admin" : "R. Baruah — Logistics Operator" };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      setAuth(session);
      return { ok: true };
    }
    return { ok: false, error: "Invalid credentials. Use the demo credentials shown below." };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
    setEmergencyMode(false);
  }, []);

  // Simulated real-time loop: move vehicles, jitter weather.
  useEffect(() => {
    const iv = setInterval(() => {
      setTick((t) => t + 1);
      setVehicles((prev) => prev.map((v) => {
        if (v.status === "Delayed") return v;
        let progress = v.progress + (v.speed > 0 ? 0.012 + Math.random() * 0.01 : 0);
        if (progress >= 1) progress = 1;
        const speed = v.status === "Delayed" ? 0 : Math.max(18, Math.round(v.speed + (Math.random() * 10 - 5)));
        const etaMin = Math.max(0, Math.round(v.etaMin * (1 - progress)));
        return { ...v, progress, speed, etaMin };
      }));
      setWeather((w) => ({
        ...w,
        rainfall: Math.max(0, Math.round((w.rainfall + (Math.random() * 6 - 3)) * 10) / 10),
        temperature: Math.round((w.temperature + (Math.random() * 1 - 0.5)) * 10) / 10,
      }));
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  // Field report -> new incident + alert
  const addIncident = useCallback((incident) => {
    const id = `NER-HAZ-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const full = {
      id, status: "pending", time: "just now", reportedBy: auth?.name || "Field Reporter",
      ...incident,
    };
    setIncidents((prev) => [full, ...prev]);
    setAlerts((prev) => [{
      id: `al-${Date.now()}`,
      severity: incident.severity || "warning",
      title: `New field report: ${incident.type}`,
      location: incident.location,
      time: "just now",
      description: incident.description,
      action: "Awaiting command verification.",
    }, ...prev]);
    return id;
  }, [auth]);

  // Admin actions on incidents
  const updateIncidentStatus = useCallback((id, status) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }, []);

  const updateRoadStatus = useCallback((roadId, status) => {
    setRoads((prev) => prev.map((r) => (r.id === roadId ? { ...r, status, updated: "just now" } : r)));
  }, []);

  const value = {
    auth, login, logout,
    roads, setRoads, updateRoadStatus,
    vehicles, incidents, alerts, weather,
    addIncident, updateIncidentStatus,
    emergencyMode, setEmergencyMode,
    resetDemo,
    tick,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
