import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { CITIES } from "@/data/mockData";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  ShieldAlert,
  MapPin,
  Locate,
  Phone,
  Radio,
  Truck,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Signal,
  Send,
  PhoneCall,
  Flame,
  Waves,
  Mountain,
  CloudRain,
} from "lucide-react";

const SOS_TYPES = [
  { id: "vehicle_breakdown", label: "Vehicle Breakdown", icon: Truck, color: "text-amber-600" },
  { id: "medical", label: "Medical Emergency", icon: HeartPulse, color: "text-red-600" },
  { id: "road_blocked", label: "Road Blocked / Stranded", icon: AlertTriangle, color: "text-orange-600" },
  { id: "landslide", label: "Landslide / Debris", icon: Mountain, color: "text-red-700" },
  { id: "flood", label: "Flood / Water Rising", icon: Waves, color: "text-blue-600" },
  { id: "fire", label: "Vehicle / Cargo Fire", icon: Flame, color: "text-red-500" },
  { id: "weather", label: "Severe Weather", icon: CloudRain, color: "text-slate-600" },
  { id: "other", label: "Other Emergency", icon: Siren, color: "text-purple-600" },
];

const EMERGENCY_CONTACTS = [
  { name: "NDRF Control Room", number: "011-26107953", type: "National" },
  { name: "NER Emergency Ops", number: "1800-XXX-XXXX", type: "Regional" },
  { name: "Police (Nearest)", number: "100", type: "Local" },
  { name: "Ambulance", number: "108", type: "Medical" },
  { name: "Fire Services", number: "101", type: "Fire" },
  { name: "Road Rescue (BRO)", number: "1800-XXX-XXXX", type: "Highway" },
];

export default function EmergencySOS() {
  const {
    emergencyMode,
    setEmergencyMode,
    activeTrip,
    vehicles,
    addIncident,
  } = useApp();

  const [sosType, setSosType] = useState("");
  const [description, setDescription] = useState("");
  const [gps, setGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosHistory, setSosHistory] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [nearestCity, setNearestCity] = useState(null);

  // Get GPS coordinates
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this device.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude.toFixed(5),
          lon: pos.coords.longitude.toFixed(5),
          accuracy: Math.round(pos.coords.accuracy),
        };
        setGps(coords);
        setGpsLoading(false);

        // Find nearest city
        let minDist = Infinity;
        let closest = null;
        Object.values(CITIES).forEach((city) => {
          const d = Math.hypot(city.lat - coords.lat, city.lon - coords.lon);
          if (d < minDist) {
            minDist = d;
            closest = city;
          }
        });
        setNearestCity(closest);
        toast.success(`GPS locked — ${coords.lat}°N, ${coords.lon}°E (±${coords.accuracy}m)`);
      },
      (err) => {
        setGpsLoading(false);
        // Use fallback coordinates (Guwahati area)
        const fallback = { lat: "26.14000", lon: "91.74000", accuracy: 500 };
        setGps(fallback);
        setNearestCity(CITIES.guwahati);
        toast.info("Using approximate location (GPS unavailable in demo).");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Countdown for SOS broadcast
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      broadcastSOS();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const broadcastSOS = () => {
    setSosActive(true);
    setEmergencyMode(true);

    const sosEntry = {
      id: `SOS-${Date.now()}`,
      type: sosType || "other",
      label: SOS_TYPES.find((s) => s.id === sosType)?.label || "Emergency",
      description: description || "Emergency SOS — no details provided.",
      gps,
      nearestCity: nearestCity?.name || "Unknown",
      vehicle: activeTrip?.vehicleId || vehicles?.[0]?.id || "NER-TRUCK-101",
      timestamp: new Date().toISOString(),
      status: "ACTIVE",
    };

    setSosHistory((prev) => [sosEntry, ...prev]);

    // Add as incident to the global system
    if (addIncident) {
      addIncident({
        type: sosEntry.label,
        location: nearestCity
          ? `Near ${nearestCity.name}, ${nearestCity.state}`
          : `GPS: ${gps?.lat}, ${gps?.lon}`,
        lat: parseFloat(gps?.lat || 26.14),
        lon: parseFloat(gps?.lon || 91.74),
        severity: "critical",
        reportedBy: "Emergency SOS Beacon",
        description: sosEntry.description,
        status: "pending",
      });
    }

    toast.error("🚨 EMERGENCY SOS BROADCAST — All nearby units alerted", {
      duration: 8000,
      description: `${sosEntry.label} · ${nearestCity?.name || "Location acquired"} · NDRF notified (simulated)`,
    });
  };

  const startSOS = () => {
    if (!sosType) {
      toast.error("Please select an emergency type before triggering SOS.");
      return;
    }
    setCountdown(3);
    toast.info("SOS broadcasting in 3 seconds… Tap Cancel to abort.", { duration: 3500 });
  };

  const cancelCountdown = () => {
    setCountdown(null);
    toast.info("SOS countdown cancelled.");
  };

  const clearSOS = () => {
    setSosActive(false);
    setEmergencyMode(false);
    toast.success("Emergency SOS cleared — normal operations resumed.");
  };

  const selectedType = SOS_TYPES.find((s) => s.id === sosType);

  return (
    <div className="space-y-6" data-testid="emergency-sos-page">
      {/* Header */}
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Emergency SOS
        </h1>
        <p className="text-sm text-slate-500">
          Activate SOS beacon to broadcast your location and alert NDRF, nearby units and command center.
        </p>
      </div>

      {/* Active SOS Banner */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl border-2 border-red-400 bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-6 text-white shadow-lg"
          >
            {/* Pulse background */}
            <div className="absolute inset-0 animate-pulse bg-red-500/20" />

            <div className="relative flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                <Siren className="h-7 w-7 animate-bounce" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                  </span>
                  <h2 className="font-head text-lg font-bold uppercase tracking-wide">
                    SOS Beacon Active
                  </h2>
                </div>
                <p className="text-sm text-red-100">
                  Your emergency broadcast is live. Nearby rescue units, NDRF, and command center have been alerted.
                  GPS coordinates are being shared in real-time.
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-xs font-mono">
                  <span className="rounded-full bg-white/20 px-2.5 py-1">
                    📍 {gps ? `${gps.lat}°N, ${gps.lon}°E` : "Acquiring..."}
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1">
                    🏙️ {nearestCity?.name || "—"}
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1">
                    🚛 {activeTrip?.vehicleId || "NER-TRUCK-101"}
                  </span>
                </div>
              </div>
              <Button
                onClick={clearSOS}
                variant="outline"
                className="shrink-0 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Clear SOS
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: SOS Form */}
        <div className="space-y-4 lg:col-span-2">
          {/* SOS Type Selection */}
          <DashboardCard title="Emergency Type" icon={ShieldAlert} accent="hazard" testId="sos-type-card">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SOS_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = sosType === type.id;
                return (
                  <button
                    key={type.id}
                    data-testid={`sos-type-${type.id}`}
                    onClick={() => setSosType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                      isSelected
                        ? "border-red-400 bg-red-50 ring-2 ring-red-300/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl transition-colors",
                        isSelected ? "bg-red-100" : "bg-slate-100"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isSelected ? "text-red-600" : type.color)} />
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isSelected ? "text-red-700" : "text-slate-600"
                      )}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </DashboardCard>

          {/* SOS Details */}
          <DashboardCard title="Situation Details" icon={AlertTriangle} accent="caution" testId="sos-details-card">
            <div className="space-y-4">
              {/* GPS Coordinates */}
              <div>
                <Label className="text-slate-600">GPS Location</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-700">
                    {gps ? (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                        {gps.lat}°N, {gps.lon}°E
                        <span className="text-slate-400">±{gps.accuracy}m</span>
                        {nearestCity && (
                          <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600">
                            Near {nearestCity.name}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-slate-400">Acquiring GPS fix...</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={gpsLoading}
                    onClick={getLocation}
                    className="shrink-0"
                  >
                    <Locate className={cn("h-4 w-4", gpsLoading && "animate-spin")} />
                  </Button>
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <Label className="text-slate-600">Vehicle / Convoy ID</Label>
                <Select
                  defaultValue={activeTrip?.vehicleId || vehicles?.[0]?.id || "NER-TRUCK-101"}
                >
                  <SelectTrigger className="mt-1.5" data-testid="sos-vehicle-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.id} — {v.goods || "Cargo"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label className="text-slate-600">Describe the situation (optional)</Label>
                <Textarea
                  data-testid="sos-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Vehicle stalled near river crossing, water level rising, 3 crew members aboard..."
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
            </div>
          </DashboardCard>

          {/* SOS Action Button */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {countdown !== null ? (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-3 rounded-2xl border-2 border-red-300 bg-red-50 p-6"
                >
                  <div className="relative grid h-20 w-20 place-items-center rounded-full bg-red-600 text-white shadow-lg shadow-red-300/50">
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-40" />
                    <span className="relative font-mono text-3xl font-bold">{countdown}</span>
                  </div>
                  <p className="font-head text-sm font-semibold text-red-700">
                    Broadcasting SOS in {countdown} second{countdown !== 1 ? "s" : ""}…
                  </p>
                  <Button
                    onClick={cancelCountdown}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-100"
                  >
                    Cancel
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {!sosActive ? (
                    <Button
                      data-testid="sos-broadcast-btn"
                      onClick={startSOS}
                      className="w-full gap-2 rounded-xl bg-red-600 py-6 text-base font-bold shadow-lg shadow-red-300/40 hover:bg-red-700 hover:shadow-red-400/50 transition-all active:scale-[0.98]"
                    >
                      <Siren className="h-5 w-5" />
                      Broadcast Emergency SOS
                    </Button>
                  ) : (
                    <Button
                      data-testid="sos-clear-btn"
                      onClick={clearSOS}
                      variant="outline"
                      className="w-full gap-2 rounded-xl border-emerald-300 bg-emerald-50 py-6 text-base font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Clear Emergency — Resume Normal Ops
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-400">
              SOS will broadcast your GPS coordinates to NDRF, nearby response units, and command center.
              This is a simulated demonstration.
            </p>
          </div>

          {/* SOS History */}
          {sosHistory.length > 0 && (
            <DashboardCard title="SOS Broadcast Log" icon={Radio} accent="hazard" testId="sos-history-card">
              <div className="space-y-2">
                {sosHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                        entry.status === "ACTIVE" ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-500"
                      )}
                    >
                      <Siren className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{entry.label}</p>
                      <p className="truncate text-xs text-slate-500">
                        {entry.nearestCity} · {entry.vehicle} ·{" "}
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase",
                        entry.status === "ACTIVE"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      )}
                    >
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}
        </div>

        {/* RIGHT: Emergency Contacts & Quick Info */}
        <div className="space-y-4">
          {/* Emergency Contacts */}
          <DashboardCard title="Emergency Contacts" icon={Phone} accent="hazard" testId="sos-contacts-card">
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-red-200 hover:bg-red-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
                    <PhoneCall className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{contact.name}</p>
                    <p className="font-mono text-xs text-slate-500">{contact.number}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500">
                    {contact.type}
                  </span>
                </a>
              ))}
            </div>
          </DashboardCard>

          {/* Active Trip Info */}
          <DashboardCard title="Your Active Trip" icon={Truck} accent="navy" testId="sos-trip-card">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Trip</span>
                <span className="font-mono font-semibold text-slate-800">
                  {activeTrip?.id || "NER-MED-102"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route</span>
                <span className="text-slate-700">{activeTrip?.corridor || "NH-415"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">From → To</span>
                <span className="text-slate-700">
                  {activeTrip?.source || "Guwahati"} → {activeTrip?.dest || "Itanagar"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle</span>
                <span className="font-mono text-slate-700">
                  {activeTrip?.vehicleId || "NER-TRUCK-101"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ETA</span>
                <span className="font-semibold text-slate-700">
                  {activeTrip?.eta || "4h 35m"}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Safety Protocol */}
          <DashboardCard title="Safety Protocol" icon={ShieldAlert} accent="caution" testId="sos-protocol-card">
            <div className="space-y-3">
              {[
                { step: "1", text: "Select emergency type and broadcast SOS" },
                { step: "2", text: "Stay with your vehicle if safe to do so" },
                { step: "3", text: "Share GPS coordinates with rescue teams" },
                { step: "4", text: "Activate hazard lights and warning triangles" },
                { step: "5", text: "Wait for NDRF / rescue response" },
                { step: "6", text: "Clear SOS once situation is resolved" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                    {item.step}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Network Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Signal className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-700">Network Status</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">VHF Radio</span>
                <span className="font-mono text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Satellite Link</span>
                <span className="font-mono text-emerald-600">Connected</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Cellular</span>
                <span className="font-mono text-amber-600">Weak (2G)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">GPS Fix</span>
                <span className="font-mono text-emerald-600">
                  {gps ? "Locked" : "Acquiring..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
