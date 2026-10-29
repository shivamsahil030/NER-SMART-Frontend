import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ROADS as ROADS_SEED,
  VEHICLES as VEHICLES_SEED,
  INCIDENTS_SEED,
  ALERTS_SEED,
  WEATHER as WEATHER_SEED,
  TRIPS as TRIPS_SEED,
  DEMO_CREDENTIALS,
} from "@/data/mockData";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const AUTH_KEY = "ner_smart_auth";
const API_URL = "http://127.0.0.1:8000";
const STATE_KEY = "ner_smart_state";

const DEFAULT_ACTIVE_TRIP = {
  id: "NER-MED-102",
  title: "Medical Supply Delivery",
  source: "Guwahati (AS)",
  dest: "Itanagar (AR)",
  goods: "Medical Supplies & Oxygen",
  eta: "4h 35m",
  risk: "LOW",
  riskScore: 28,
  lastSync: "Just now",
  status: "In Transit",
  corridor: "NH-415 / NH-15",
  vehicleId: "NER-TRUCK-102",
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STATE_KEY)) || {};
  } catch {
    return {};
  }
}

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
    } catch {
      return null;
    }
  });

  const [roads, setRoads] = useState(
    () => loadState().roads || ROADS_SEED
  );

  const [vehicles, setVehicles] = useState(VEHICLES_SEED);

  const [incidents, setIncidents] = useState(
    () => loadState().incidents || INCIDENTS_SEED
  );

  const [alerts, setAlerts] = useState(
    () => loadState().alerts || ALERTS_SEED
  );

  const [weather, setWeather] = useState(WEATHER_SEED);

  const [disruptions, setDisruptions] = useState([]);

  const [trips, setTrips] = useState(
    () => loadState().trips || TRIPS_SEED
  );

  const [activeTrip, setActiveTrip] = useState(
    () => loadState().activeTrip || DEFAULT_ACTIVE_TRIP
  );

  const [emergencyMode, setEmergencyMode] = useState(
    () => loadState().emergencyMode || false
  );

  const [tick, setTick] = useState(0);

  // --------------------------------------------------
  // FETCH DATA FROM FASTAPI BACKEND
  // --------------------------------------------------

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [
          weatherResponse,
          roadsResponse,
          vehiclesResponse,
          alertsResponse,
          disruptionsResponse,
          shipmentsResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/weather/`).catch(() => null),
          axios.get(`${API_URL}/roads/`).catch(() => null),
          axios.get(`${API_URL}/vehicles/`).catch(() => null),
          axios.get(`${API_URL}/alerts/`).catch(() => null),
          axios.get(`${API_URL}/disruptions/`).catch(() => null),
          axios.get(`${API_URL}/shipments/`).catch(() => null),
        ]);

        // Weather
        if (
          weatherResponse?.data?.weather &&
          weatherResponse.data.weather.length > 0
        ) {
          setWeather(weatherResponse.data.weather[0]);
        }

        // Roads: Merge backend status/risk with geographical network
        if (
          roadsResponse?.data?.roads &&
          roadsResponse.data.roads.length > 0
        ) {
          const backendRoads = roadsResponse.data.roads;
          setRoads((prevRoads) => {
            return prevRoads.map((seedRoad) => {
              const match = backendRoads.find(
                (br) =>
                  br.id === seedRoad.id ||
                  br.road_id === seedRoad.road_id ||
                  (br.name &&
                    seedRoad.name &&
                    seedRoad.name.toLowerCase().includes(br.name.toLowerCase().slice(0, 8)))
              );
              if (match) {
                return {
                  ...seedRoad,
                  ...match,
                  id: seedRoad.id,
                  from: seedRoad.from,
                  to: seedRoad.to,
                  status: (match.status || seedRoad.status).toLowerCase(),
                  riskScore: match.riskScore ?? match.risk_score ?? seedRoad.riskScore,
                  risk_score: match.risk_score ?? match.riskScore ?? seedRoad.riskScore,
                };
              }
              return seedRoad;
            });
          });
        }

        // Vehicles
        if (
          vehiclesResponse?.data?.vehicles &&
          vehiclesResponse.data.vehicles.length > 0
        ) {
          setVehicles((prevVehicles) => {
            const bVehicles = vehiclesResponse.data.vehicles;
            // Merge with local telemetry
            return prevVehicles.map((pv, idx) => {
              const bv = bVehicles[idx] || bVehicles.find((b) => b.vehicleId === pv.id);
              if (bv) {
                return {
                  ...pv,
                  speed: bv.currentSpeedKmph ?? pv.speed,
                  currentSpeedKmph: bv.currentSpeedKmph ?? pv.speed,
                  status: bv.status === "ON_ROUTE" ? "In Transit" : bv.status || pv.status,
                };
              }
              return pv;
            });
          });
        }

        // Alerts
        if (
          alertsResponse?.data?.alerts &&
          alertsResponse.data.alerts.length > 0
        ) {
          const formattedAlerts = alertsResponse.data.alerts.map((a, i) => ({
            id: a.id || `al-backend-${i}`,
            severity: (a.severity || "warning").toLowerCase(),
            title: a.title || a.message || "Route Advisory",
            location: a.location || "North Eastern Sector",
            time: "just now",
            description: a.message || a.description || "Advisory notice for active convoys.",
            action: a.action || "Proceed with caution.",
          }));

          setAlerts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = formattedAlerts.filter((fa) => !existingIds.has(fa.id));
            return [...newOnes, ...prev];
          });
        }

        // Disruptions
        if (disruptionsResponse?.data?.disruptions) {
          setDisruptions(disruptionsResponse.data.disruptions);
        }

        // Shipments -> Trips
        if (shipmentsResponse?.data?.shipments && shipmentsResponse.data.shipments.length > 0) {
          const bShipments = shipmentsResponse.data.shipments;
          const mappedTrips = bShipments.map((s, idx) => ({
            id: s.shipmentId || `TRP-${idx + 1000}`,
            source: s.origin?.name || "Guwahati",
            dest: s.destination?.name || "Shillong",
            goods: s.cargoType || "Essential Goods",
            date: new Date().toISOString().split("T")[0],
            route: s.route?.currentRouteId || "NH-27",
            status: s.status === "IN_TRANSIT" ? "In Transit" : s.status === "CREATED" ? "On Schedule" : "Delivered",
            delay: "On time",
          }));

          setTrips((prevTrips) => {
            const existingIds = new Set(prevTrips.map((p) => p.id));
            const newTrips = mappedTrips.filter((mt) => !existingIds.has(mt.id));
            return [...newTrips, ...prevTrips];
          });
        }

        console.log("NER SMART: Live backend data synchronized successfully");
      } catch (error) {
        console.warn(
          "NER SMART: Backend unavailable. Using fallback state.",
          error?.message
        );
      }
    };

    loadBackendData();
  }, []);

  // --------------------------------------------------
  // PERSIST DEMO STATE
  // --------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        roads,
        incidents,
        alerts,
        trips,
        activeTrip,
        emergencyMode,
      })
    );
  }, [roads, incidents, alerts, trips, activeTrip, emergencyMode]);

  // --------------------------------------------------
  // RESET DEMO
  // --------------------------------------------------

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STATE_KEY);

    setRoads(ROADS_SEED);
    setVehicles(VEHICLES_SEED);
    setIncidents(INCIDENTS_SEED);
    setAlerts(ALERTS_SEED);
    setWeather(WEATHER_SEED);
    setTrips(TRIPS_SEED);
    setActiveTrip(DEFAULT_ACTIVE_TRIP);
    setEmergencyMode(false);
  }, []);

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = useCallback((role, email, password) => {
    const cred = DEMO_CREDENTIALS[role];

    if (
      email?.trim().toLowerCase() === cred.email &&
      password === cred.password
    ) {
      const session = {
        role,
        email: cred.email,
        name:
          role === "admin"
            ? "State Command Admin"
            : "R. Baruah — Logistics Operator",
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      setAuth(session);

      return { ok: true };
    }

    return {
      ok: false,
      error: "Invalid credentials. Use the demo credentials shown below.",
    };
  }, []);

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
    setEmergencyMode(false);
  }, []);

  // --------------------------------------------------
  // SIMULATED REAL-TIME VEHICLE MOVEMENT
  // --------------------------------------------------

  useEffect(() => {
    const iv = setInterval(() => {
      setTick((t) => t + 1);

      setVehicles((prev) =>
        prev.map((v) => {
          const currentSpeed =
            v.speed ?? v.currentSpeedKmph ?? 0;

          const status = v.status;

          if (
            status === "Delayed" ||
            status === "MAINTENANCE" ||
            status === "AVAILABLE"
          ) {
            return v;
          }

          let progress =
            (v.progress || 0) +
            (currentSpeed > 0
              ? 0.012 + Math.random() * 0.01
              : 0);

          if (progress >= 1) {
            progress = 1;
          }

          const newSpeed =
            currentSpeed > 0
              ? Math.max(
                  18,
                  Math.round(
                    currentSpeed + (Math.random() * 10 - 5)
                  )
                )
              : 0;

          const etaMin = Math.max(
            0,
            Math.round(
              (v.etaMin || 0) * (1 - progress)
            )
          );

          return {
            ...v,
            progress,
            speed: newSpeed,
            currentSpeedKmph: newSpeed,
            etaMin,
          };
        })
      );
    }, 3500);

    return () => clearInterval(iv);
  }, []);

  // --------------------------------------------------
  // DISPATCH / START NEW TRIP
  // --------------------------------------------------

  const dispatchTrip = useCallback(
    async (tripData) => {
      const tripId = `TRP-${Math.floor(1000 + Math.random() * 8999)}`;
      const newTrip = {
        id: tripId,
        source: tripData.sourceName || tripData.source || "Guwahati",
        dest: tripData.destName || tripData.dest || "Itanagar",
        goods: tripData.goodsName || tripData.goods || "Medical Supplies",
        date: new Date().toISOString().split("T")[0],
        route: tripData.routeName || tripData.routeId || "NH-415 Corridor",
        status: "In Transit",
        delay: "On schedule",
        eta: tripData.eta || "3h 45m",
        risk: (tripData.risk || "LOW").toUpperCase(),
        riskScore: tripData.riskScore || 22,
        lastSync: "Just now",
        corridor: tripData.corridor || "NH-415",
        vehicleId: tripData.vehicleId || "NER-TRUCK-101",
      };

      setActiveTrip(newTrip);
      setTrips((prev) => [newTrip, ...prev]);

      // Add corresponding moving vehicle in live tracking
      setVehicles((prev) => {
        const vehicleExists = prev.some((v) => v.id === newTrip.vehicleId);
        if (vehicleExists) {
          return prev.map((v) =>
            v.id === newTrip.vehicleId
              ? {
                  ...v,
                  status: "In Transit",
                  speed: 38,
                  progress: 0.05,
                  goods: newTrip.goods,
                  source: (tripData.source || "guwahati").toLowerCase(),
                  dest: (tripData.dest || "itanagar").toLowerCase(),
                }
              : v
          );
        }
        return [
          {
            id: newTrip.vehicleId,
            goods: newTrip.goods,
            driver: auth?.name || "R. Baruah",
            source: (tripData.source || "guwahati").toLowerCase(),
            dest: (tripData.dest || "itanagar").toLowerCase(),
            speed: 40,
            etaMin: 180,
            status: "In Transit",
            risk: (tripData.risk || "low").toLowerCase(),
            progress: 0.05,
            emergency: false,
          },
          ...prev,
        ];
      });

      // Post shipment to backend
      try {
        await axios.post(`${API_URL}/shipments/`, {
          shipmentId: tripId,
          cargoType: newTrip.goods,
          cargoDescription: `${newTrip.goods} dispatched via ${newTrip.route}`,
          quantity: 1200,
          unit: "kg",
          priority: "HIGH",
          origin: {
            name: newTrip.source,
            latitude: 26.14,
            longitude: 91.74,
          },
          destination: {
            name: newTrip.dest,
            latitude: 27.08,
            longitude: 93.60,
          },
          vehicleId: newTrip.vehicleId,
        });
      } catch (err) {
        console.warn("Backend shipment creation fallback:", err?.message);
      }

      return newTrip;
    },
    [auth]
  );

  // --------------------------------------------------
  // FIELD REPORT → INCIDENT + ALERT + BACKEND SYNC
  // --------------------------------------------------

  const addIncident = useCallback(
    async (incident) => {
      const id = `NER-HAZ-2026-${Math.floor(
        1000 + Math.random() * 8999
      )}`;

      const full = {
        id,
        status: "pending",
        time: "just now",
        reportedBy: auth?.name || "Field Reporter",
        ...incident,
      };

      setIncidents((prev) => [full, ...prev]);

      const alertItem = {
        id: `al-${Date.now()}`,
        severity: (incident.severity || "warning").toLowerCase(),
        title: `Field Hazard: ${incident.type}`,
        location: incident.location,
        time: "just now",
        description: incident.description,
        action: "Awaiting command verification.",
      };

      setAlerts((prev) => [alertItem, ...prev]);

      // Sync to backend disruptions
      try {
        await axios.post(`${API_URL}/disruptions/`, {
          location: incident.location,
          type: incident.type,
          severity: (incident.severity || "HIGH").toUpperCase(),
          status: "ACTIVE",
          description: incident.description,
          latitude: incident.lat,
          longitude: incident.lon,
          reportedBy: auth?.name || "Field Reporter",
        });
      } catch (err) {
        console.warn("Disruption sync fallback:", err?.message);
      }

      // Sync to backend events
      try {
        await axios.post(`${API_URL}/events/`, {
          shipmentId: activeTrip?.id || "1",
          vehicleId: "V001",
          eventType: "FIELD_HAZARD_REPORTED",
          description: `${incident.type}: ${incident.description}`,
          locationName: incident.location,
        });
      } catch (err) {
        console.warn("Event sync fallback:", err?.message);
      }

      return id;
    },
    [auth, activeTrip]
  );

  // --------------------------------------------------
  // ADMIN INCIDENT ACTION
  // --------------------------------------------------

  const updateIncidentStatus = useCallback(
    (id, status) => {
      setIncidents((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status } : i
        )
      );
    },
    []
  );

  // --------------------------------------------------
  // ADMIN ROAD ACTION
  // --------------------------------------------------

  const updateRoadStatus = useCallback(
    (roadId, status) => {
      setRoads((prev) =>
        prev.map((r) =>
          (r.id === roadId || r.road_id === roadId)
            ? {
                ...r,
                status,
                updated: "just now",
              }
            : r
        )
      );
    },
    []
  );

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = {
    auth,
    login,
    logout,

    roads,
    setRoads,
    updateRoadStatus,

    vehicles,
    setVehicles,

    incidents,

    alerts,

    weather,

    disruptions,

    trips,
    setTrips,

    activeTrip,
    setActiveTrip,
    dispatchTrip,

    addIncident,
    updateIncidentStatus,

    emergencyMode,
    setEmergencyMode,

    resetDemo,

    tick,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}