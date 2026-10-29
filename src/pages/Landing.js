import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Navbar } from "@/components/Navbar";

import { Brand } from "@/components/Brand";

import RealMap from "@/components/RealMap";

import { MapLegend } from "@/components/MapLegend";

import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useApp } from "@/context/AppContext";

import { motion } from "framer-motion";

import { toast } from "sonner";

import axios from "axios";

import {
  ArrowRight,
  Play,
  MapPin,
  Sparkles,
  Brain,
  Route,
  Truck,
  BellRing,
  RadioTower,
  ShieldCheck,
  TrendingDown,
  Clock,
  Leaf,
  Mountain,
  CheckCircle2,
  CloudRain,
  AlertTriangle,
  Navigation,
  Activity,
  Gauge,
  Signal,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Mail,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const IMG = {
  hero: "https://images.unsplash.com/photo-1719236422698-9fe3b782a265?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",

  cta: "https://images.unsplash.com/photo-1719236420187-eeb9cac890ee?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",

  ai: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",

  route: "https://images.unsplash.com/photo-1719236409879-92efe1b837e3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",

  track: "https://images.unsplash.com/photo-1628655207872-76a915ecc5e3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",

  alerts: "https://images.unsplash.com/photo-1732442719156-99ecfcc5373a?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",

  tower: "https://images.unsplash.com/photo-1708807472445-d33589e6b090?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",

  truck: "https://images.unsplash.com/photo-1577634670297-f7700eabf3fe?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
};

const DEMO_VIDEO =
  "https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4";

const STATS = [
  { value: "8", label: "States Covered", icon: MapPin },
  { value: "250+", label: "Active Vehicles", icon: Truck },
  { value: "98.7%", label: "On-time Delivery", icon: Clock },
  { value: "24/7", label: "AI Monitoring", icon: Activity },
  { value: "15K+", label: "Deliveries Completed", icon: ShieldCheck },
];

const STEPS = [
  { icon: MapPin, title: "Plan", desc: "Set source, destination & load details" },
  { icon: Brain, title: "AI Analyze", desc: "AI predicts risks, weather & traffic" },
  { icon: Route, title: "Optimize", desc: "Best & safest route recommended" },
  { icon: Truck, title: "Track", desc: "Live tracking, geo-fence & updates" },
  {
    icon: ShieldCheck,
    title: "Deliver Safe",
    desc: "On-time, secure delivery with insights",
  },
];

const FEATURES = [
  {
    img: IMG.ai,
    icon: Brain,
    title: "AI Risk Prediction",
    desc: "Predict landslides, floods, roadblocks and weather risks before they happen.",
  },
  {
    img: IMG.route,
    icon: Route,
    title: "Route Optimization",
    desc: "Smart routes considering terrain, traffic, weather & safety.",
  },
  {
    img: IMG.track,
    icon: Truck,
    title: "Real-time Tracking",
    desc: "Live location, speed, stops & route deviation monitoring.",
  },
  {
    img: IMG.alerts,
    icon: BellRing,
    title: "Instant Alerts",
    desc: "Timely alerts for risks, delays, deviations & emergencies.",
  },
  {
    img: IMG.tower,
    icon: RadioTower,
    title: "Control Tower",
    desc: "24/7 AI monitoring & centralized visibility across NER.",
  },
];

const IMPACT = [
  {
    icon: ShieldCheck,
    title: "Safer Roads",
    desc: "Reducing accidents & ensuring driver safety",
  },
  {
    icon: TrendingDown,
    title: "Lower Costs",
    desc: "Optimized routes & fuel efficiency",
  },
  {
    icon: Clock,
    title: "Time Efficient",
    desc: "On-time deliveries, every time",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    desc: "Lower emissions, greener logistics",
  },
  {
    icon: Mountain,
    title: "Stronger NER",
    desc: "Building a connected & resilient North-East",
  },
];

const DASH_STATS = [
  {
    label: "Active Vehicles",
    value: "23",
    sub: "Live now",
    icon: Truck,
    tone: "text-brand",
  },
  {
    label: "On-time Delivery",
    value: "98.7%",
    sub: "This month",
    icon: TrendingDown,
    tone: "text-brand",
  },
  {
    label: "Alerts",
    value: "7",
    sub: "Require attention",
    icon: BellRing,
    tone: "text-amber-400",
  },
  {
    label: "Incidents Resolved",
    value: "15",
    sub: "This month",
    icon: CheckCircle2,
    tone: "text-brand",
  },
  {
    label: "Fuel Saved",
    value: "1,245 L",
    sub: "This month",
    icon: Gauge,
    tone: "text-brand",
  },
  {
    label: "CO₂ Reduced",
    value: "32 kg",
    sub: "This month",
    icon: Leaf,
    tone: "text-brand",
  },
];

const RECENT_ALERTS = [
  {
    icon: AlertTriangle,
    color: "text-red-400",
    title: "Landslide Warning",
    loc: "NH-13, Arunachal Pradesh",
    time: "10 min ago",
  },
  {
    icon: CloudRain,
    color: "text-amber-400",
    title: "Heavy Rain Alert",
    loc: "Assam – Upper Region",
    time: "25 min ago",
  },
  {
    icon: Navigation,
    color: "text-orange-400",
    title: "Road Blockage",
    loc: "Mizoram – Aizawl Road",
    time: "1 hr ago",
  },
];

export default function Landing() {
  const { roads, vehicles, incidents, alerts, emergencyMode } = useApp();

  const [showDemo, setShowDemo] = useState(false);

  // ==============================
  // BACKEND DASHBOARD STATE
  // ==============================

  const [riskData, setRiskData] = useState(null);

  const [disruptions, setDisruptions] = useState([]);

  const [backendAlerts, setBackendAlerts] = useState([]);

  const [dashboardLoading, setDashboardLoading] = useState(true);

  // ==============================
  // LOAD BACKEND DATA
  // ==============================

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        if (mounted) {
          setDashboardLoading(true);
        }

        const results = await Promise.allSettled([
          axios.get(`${API_URL}/risk/1`),
          axios.get(`${API_URL}/disruptions/`),
          axios.get(`${API_URL}/alerts/`),
        ]);

        // ==============================
        // RISK DATA
        // ==============================

        if (results[0].status === "fulfilled") {
          if (mounted) {
            setRiskData(results[0].value.data);
          }
        } else {
          console.warn(
            "NER SMART: Risk API unavailable",
            results[0].reason
          );
        }

        // ==============================
        // DISRUPTIONS
        // ==============================

        if (results[1].status === "fulfilled") {
          const data = results[1].value.data;

          let disruptionList = [];

          if (Array.isArray(data)) {
            disruptionList = data;
          } else if (Array.isArray(data?.disruptions)) {
            disruptionList = data.disruptions;
          } else if (Array.isArray(data?.data)) {
            disruptionList = data.data;
          }

          if (mounted) {
            setDisruptions(disruptionList);
          }
        } else {
          console.warn(
            "NER SMART: Disruptions API unavailable",
            results[1].reason
          );
        }

        // ==============================
        // ALERTS
        // ==============================

        if (results[2].status === "fulfilled") {
          const data = results[2].value.data;

          let alertList = [];

          if (Array.isArray(data)) {
            alertList = data;
          } else if (Array.isArray(data?.alerts)) {
            alertList = data.alerts;
          } else if (Array.isArray(data?.data)) {
            alertList = data.data;
          }

          if (mounted) {
            setBackendAlerts(alertList);
          }
        } else {
          console.warn(
            "NER SMART: Alerts API unavailable",
            results[2].reason
          );
        }

        console.log("NER SMART: Dashboard backend data loaded");
      } catch (error) {
        console.error("NER SMART: Dashboard error", error);
      } finally {
        if (mounted) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboardData();

    // Refresh dashboard every 10 seconds
    const interval = setInterval(loadDashboardData, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ==============================
  // CALCULATE LIVE VEHICLES
  // ==============================

  const activeVehicles = Array.isArray(vehicles)
    ? vehicles.filter((vehicle) => {
        const status = String(vehicle?.status || "").toUpperCase();

        return status !== "OFFLINE";
      }).length
    : 0;

  // ==============================
  // ACTIVE DISRUPTIONS
  // ==============================

  const activeDisruptions = Array.isArray(disruptions)
    ? disruptions.filter((item) => {
        return (
          String(item?.status || "").toUpperCase() === "ACTIVE"
        );
      }).length
    : 0;

  // ==============================
  // ALERT COUNT
  // ==============================

  const totalAlerts =
    backendAlerts.length > 0
      ? backendAlerts.length
      : Array.isArray(alerts)
        ? alerts.length
        : 0;

  // ==============================
  // INCIDENT COUNT
  // ==============================

  const totalIncidents = Array.isArray(incidents)
    ? incidents.length
    : 0;

  // ==============================
  // RISK DATA
  // ==============================

  const riskScore = Number(riskData?.riskScore ?? 0);

  const riskLevel = riskData?.riskLevel || "UNKNOWN";

  // ==============================
  // RISK COLOR
  // ==============================

  const riskColor =
    riskLevel === "CRITICAL"
      ? "text-red-400"
      : riskLevel === "HIGH"
        ? "text-orange-400"
        : riskLevel === "MEDIUM"
          ? "text-amber-400"
          : "text-brand";

  // ==============================
  // BACKEND ALERTS → UI FORMAT
  // ==============================

  const recentAlerts =
    backendAlerts.length > 0
      ? backendAlerts.slice(0, 3).map((alert, index) => {
          const type = String(
            alert?.type ||
              alert?.eventType ||
              alert?.title ||
              "Alert"
          ).toUpperCase();

          let Icon = AlertTriangle;

          let color = "text-red-400";

          if (
            type.includes("RAIN") ||
            type.includes("WEATHER")
          ) {
            Icon = CloudRain;
            color = "text-amber-400";
          } else if (
            type.includes("ROAD") ||
            type.includes("BLOCK")
          ) {
            Icon = Navigation;
            color = "text-orange-400";
          } else if (
            type.includes("GPS") ||
            type.includes("VEHICLE")
          ) {
            Icon = Truck;
            color = "text-brand";
          } else if (
            type.includes("SOS") ||
            type.includes("EMERGENCY")
          ) {
            Icon = RadioTower;
            color = "text-red-400";
          }

          const title =
            alert?.title ||
            alert?.name ||
            alert?.type ||
            alert?.eventType ||
            "System Alert";

          const location =
            alert?.location ||
            alert?.locationName ||
            alert?.description ||
            "North-East Region";

          const time =
            alert?.time ||
            alert?.createdAt ||
            alert?.reportedAt ||
            "Now";

          return {
            id: alert?.id || index,
            Icon,
            color,
            title,
            location,
            time,
          };
        })
      : [];

  // ==============================
  // DISPLAY ALERTS
  // ==============================

  const displayAlerts =
    recentAlerts.length > 0
      ? recentAlerts
      : [
          {
            id: "fallback-alert",
            Icon: AlertTriangle,
            color: "text-red-400",
            title:
              activeDisruptions > 0
                ? "Active Disruption"
                : "No Active Alerts",
            location:
              activeDisruptions > 0
                ? "North-East Region"
                : "All monitored regions",
            time:
              activeDisruptions > 0
                ? "Now"
                : "System stable",
          },
        ];

  // ==============================
  // DYNAMIC DASHBOARD STATS
  // ==============================

  const dashboardStats = [
    {
      label: "Active Vehicles",
      value: dashboardLoading
        ? "..."
        : String(activeVehicles),
      sub: "Live now",
      icon: Truck,
      tone: "text-brand",
    },

    {
      label: "Risk Score",
      value: dashboardLoading
        ? "..."
        : `${riskScore}/100`,
      sub: dashboardLoading ? "Loading" : riskLevel,
      icon: ShieldCheck,
      tone: riskColor,
    },

    {
      label: "Alerts",
      value: dashboardLoading
        ? "..."
        : String(totalAlerts),
      sub: "Require attention",
      icon: BellRing,
      tone:
        totalAlerts > 0
          ? "text-amber-400"
          : "text-brand",
    },

    {
      label: "Incidents",
      value: String(totalIncidents),
      sub: "Reported",
      icon: RadioTower,
      tone: "text-brand",
    },

    {
      label: "Disruptions",
      value: dashboardLoading
        ? "..."
        : String(activeDisruptions),
      sub: "Currently active",
      icon: AlertTriangle,
      tone:
        activeDisruptions > 0
          ? "text-red-400"
          : "text-brand",
    },

    {
      label: "Tracking",
      value:
        activeVehicles > 0
          ? "LIVE"
          : "IDLE",
      sub: "Vehicle monitoring",
      icon: Activity,
      tone:
        activeVehicles > 0
          ? "text-brand"
          : "text-slate-400",
    },
  ];

  // ==============================
  // RISK MESSAGE
  // ==============================

  const riskMessage =
    riskData?.alert?.message ||
    (activeDisruptions > 0
      ? `${activeDisruptions} active disruption(s) detected in the region.`
      : "No major active disruption detected.");

  // ==============================
  // UI STARTS HERE
  // ==============================

  return (
    <div id="home" className="bg-white overflow-x-hidden">

      <Navbar />

      {/* ===== HERO ===== */}

      <section className="relative min-h-[90vh] overflow-hidden">

        <img
          src={IMG.hero}
          alt="North-East mountain highway"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8 lg:min-h-[90vh] lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-brand">

              <Sparkles className="h-3.5 w-3.5" />

              AI Powered · NER Focused

            </span>

            <h1 className="mt-5 font-head text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">

              Smarter Logistics for a Stronger{" "}

              <span className="text-brand">
                North-East
              </span>

            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">

              Real-time intelligence. Optimized routes. Safe deliveries. Connected North-East.

            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <a href="#platform" className="inline-block">

                <Button
                  size="lg"
                  data-testid="hero-explore-btn"
                  className="gap-2 bg-brand font-semibold text-ink hover:bg-brand-light"
                >
                  Explore Platform

                  <ArrowRight className="h-4 w-4" />

                </Button>

              </a>

              <Button
                size="lg"
                variant="outline"
                data-testid="hero-demo-btn"
                onClick={() => setShowDemo(true)}
                className="gap-2 border-white/25 bg-white/5 text-white hover:bg-white/10"
              >

                <Play className="h-4 w-4" />

                Watch Demo

              </Button>

            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">

              {[
                ["8", "States"],
                ["250+", "Vehicles"],
                ["98.7%", "On-time"],
                ["24/7", "AI Monitoring"],
              ].map(([v, l]) => (

                <div
                  key={l}
                  className="flex items-baseline gap-1.5"
                >

                  <span className="font-mono text-xl font-bold text-brand">
                    {v}
                  </span>

                  <span className="text-xs text-slate-400">
                    {l}
                  </span>

                </div>

              ))}

            </div>

          </motion.div>

          {/* Visual: truck + live location card */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="relative"
          >

            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">

              <img
                src={IMG.truck}
                alt="NER SMART cargo truck in transit"
                width={900}
                height={600}
                className="block h-auto w-full"
              />

              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">

                <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />

                23 Vehicles Live

              </span>

            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/95 p-4 shadow-2xl backdrop-blur sm:absolute sm:-bottom-5 sm:left-4 sm:mt-0 sm:w-56 lg:-bottom-6 lg:-left-6"
            >

              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">

                <MapPin className="h-4 w-4 text-brand-dark" />

                Live Location

              </div>

              <p className="mt-1.5 font-mono text-lg font-bold text-ink">
                AR 01 AB 1234
              </p>

              <p className="text-xs text-slate-500">
                Enroute to Guwahati, Assam
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-dark">

                <span className="h-2 w-2 rounded-full bg-brand" />

                On Time

              </div>

            </motion.div>

          </motion.div>

        </div>

      </section>

      {/* Stats ribbon */}

      <div className="relative z-20 -mt-10 sm:-mt-12 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-forest-deep/90 shadow-xl backdrop-blur sm:grid-cols-3 lg:grid-cols-5">

          {STATS.map((s, idx) => (

            <div
              key={s.label}
              className={`flex items-center gap-3 px-5 py-4 bg-forest-deep/80 hover:bg-forest-deep transition-colors ${
                idx === STATS.length - 1 ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""
              }`}
            >

              <s.icon className="h-6 w-6 shrink-0 text-brand" />

              <div>

                <p className="font-mono text-xl font-bold text-white leading-tight">
                  {s.value}
                </p>

                <p className="text-[11px] text-slate-400 whitespace-nowrap">
                  {s.label}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ===== AI RISK INSIGHT ===== */}

      <section
        id="platform"
        className="bg-slate-50 pt-16 pb-16"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-forest p-6 text-white shadow-xl sm:p-8">

            <img
              src={IMG.ai}
              alt=""
              className="pointer-events-none absolute right-0 top-0 h-40 w-40 object-cover opacity-20"
            />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">

              <div className="flex items-center gap-5">

                <div className="relative grid h-24 w-24 shrink-0 place-items-center">

                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 96 96"
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#7CB342"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(riskScore / 100) * 251} 251`}
                    />
                  </svg>

                  <div className="text-center">
                    <p className="font-mono text-2xl font-bold">
                      {dashboardLoading ? "..." : `${riskScore}%`}
                    </p>
                    <p className="text-[9px] uppercase text-slate-400">
                      Risk Score
                    </p>
                  </div>

                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    Live intelligence
                  </p>
                  <h3 className="mt-1 font-head text-2xl font-bold">
                    AI Risk Prediction
                  </h3>
                </div>

              </div>

              <div className="max-w-2xl">
                <p className={`font-semibold ${riskColor}`}>
                  {dashboardLoading
                    ? "Analyzing Risk..."
                    : riskLevel === "UNKNOWN"
                      ? "Risk Status Unavailable"
                      : `${riskLevel} Risk Ahead`}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {dashboardLoading
                    ? "AI is analyzing current logistics conditions."
                    : riskMessage}
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-lime-300"
                data-testid="ai-risk-view-details"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ===== HOW IT WORKS ===== */}

      <section
        id="solutions"
        className="bg-white py-16"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <h2 className="text-center font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">

            How{" "}

            <span className="text-brand-dark">
              NER SMART
            </span>{" "}

            Works

          </h2>

          <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-6">

            <div className="lg:col-span-5">

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">

                {STEPS.map((s, i) => (

                  <div
                    key={s.title}
                    className="relative flex flex-col items-center justify-start h-full rounded-xl border border-slate-200 bg-white p-4 text-center card-elev"
                  >

                    <span className="mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand/10 text-brand-dark">

                      <s.icon className="h-6 w-6" />

                    </span>

                    <p className="mt-3 font-head text-sm font-semibold text-ink">
                      {s.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {s.desc}
                    </p>

                    {i < STEPS.length - 1 && (

                      <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-brand/50 lg:block" />

                    )}

                  </div>

                ))}

              </div>

            </div>

            <div className="flex flex-col sm:flex-row sm:justify-around lg:flex-col lg:justify-center gap-3 rounded-xl bg-forest p-5 text-white">

              {[
                "Safer Roads.",
                "Lower Costs.",
                "Stronger NER.",
              ].map((t) => (

                <p
                  key={t}
                  className="flex items-center gap-2 font-head text-base font-semibold"
                >

                  <ShieldCheck className="h-5 w-5 text-brand" />

                  {t}

                </p>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ===== LIVE OPERATIONS DASHBOARD ===== */}

      <section
        id="dashboard"
        className="bg-ink py-16 text-white"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">

            <h2 className="font-head text-2xl font-bold tracking-tight sm:text-3xl">
              Live Operations Dashboard
            </h2>

            <Link
              to="/login"
              className="text-sm font-semibold text-brand hover:underline"
              data-testid="dashboard-viewall"
            >
              View All →
            </Link>

          </div>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* Map */}

            <div className="lg:col-span-2">

              <div className="rounded-2xl border border-white/10 bg-forest-deep p-3">

                <div className="mb-3 flex items-center justify-between">

                  <span className="flex items-center gap-2 text-sm font-semibold">

                    <Signal className="h-4 w-4 text-brand" />

                    Live Vehicle Map

                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-slate-400">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />

                    {dashboardLoading
                      ? "Loading Vehicles..."
                      : `${activeVehicles} Vehicles Live`}

                  </span>

                </div>

                <RealMap
                  roads={roads}
                  vehicles={vehicles}
                  incidents={incidents}
                  emergencyMode={emergencyMode}
                  height={380}
                  className="border-white/10"
                />

                <MapLegend className="mt-3" />

              </div>

            </div>

            {/* Right column */}

            <div className="flex flex-col justify-between gap-4">

              <div className="flex-1 rounded-2xl border border-white/10 bg-forest-deep p-4 flex flex-col justify-between">

                <div>

                  <p className="mb-3 text-sm font-semibold">
                    Recent Alerts
                  </p>

                  <div className="space-y-3">

                    {displayAlerts.map((a) => {

                      const AlertIcon = a.Icon || a.icon || AlertTriangle;

                      return (

                        <div
                          key={a.id || a.title}
                          className="flex items-start gap-2.5"
                        >

                          <AlertIcon
                            className={`mt-0.5 h-5 w-5 shrink-0 ${a.color || "text-red-400"}`}
                          />

                          <div className="min-w-0 flex-1">

                            <p className="text-sm font-medium text-white">
                              {a.title}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                              {a.location || a.loc}
                            </p>

                          </div>

                          <span className="shrink-0 text-[10px] text-slate-500">
                            {a.time}
                          </span>

                        </div>

                      );
                    })}

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">

                <div className="flex items-center gap-3">

                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-500 font-head text-xs font-bold text-white">
                    SOS
                  </span>

                  <div>

                    <p className="text-sm font-semibold text-white">
                      SOS & Support
                    </p>

                    <p className="text-xs text-slate-300">
                      One-tap SOS, driver support & quick incident response.
                    </p>

                  </div>

                </div>

                <Button
                  onClick={() =>
                    toast.error(
                      "SOS request sent — support team notified (simulated)."
                    )
                  }
                  data-testid="sos-request-btn"
                  className="mt-3 w-full bg-red-600 font-semibold text-white hover:bg-red-700"
                >
                  Request Help
                </Button>

              </div>

            </div>

          </div>

          {/* Stats grid */}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {dashboardStats.map((s) => (

              <div
                key={s.label}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-forest-deep p-4"
              >

                <div className="flex items-center justify-between gap-2">

                  <span className="truncate text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {s.label}
                  </span>

                  <s.icon
                    className={`h-4 w-4 shrink-0 ${s.tone}`}
                  />

                </div>

                <p className="mt-1.5 font-mono text-xl font-bold text-white">
                  {s.value}
                </p>

                <p className="text-[10px] text-slate-500">
                  {s.sub}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ===== FEATURE CARDS ===== */}

      <section
        id="features"
        className="bg-slate-50 py-16"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-dark">
              Platform Capabilities
            </span>

            <h2 className="mt-2 font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Built for North-East logistics
            </h2>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {FEATURES.map((f, i) => (

              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white card-elev ${
                  i === FEATURES.length - 1 ? "sm:col-span-2 lg:col-span-1 sm:max-w-xs sm:mx-auto lg:max-w-none w-full" : ""
                }`}
              >

                <div className="relative h-32 shrink-0">

                  <img
                    src={f.img}
                    alt={f.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />

                  <span className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-lg bg-brand text-ink">

                    <f.icon className="h-5 w-5" />

                  </span>

                </div>

                <div className="flex-1 p-4 flex flex-col justify-between">

                  <div>

                    <h3 className="font-head text-base font-semibold text-ink">
                      {f.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {f.desc}
                    </p>

                  </div>

                  <div className="pt-3">

                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-dark transition-all hover:gap-2"
                      data-testid={`feature-learn-${i}`}
                    >

                      Learn More

                      <ArrowRight className="h-3.5 w-3.5" />

                    </Link>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ===== IMPACT ===== */}

      <section
        id="impact"
        className="bg-white pt-16 pb-8"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <h2 className="text-center font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">

            Impacting{" "}

            <span className="text-brand-dark">
              North-East
            </span>
            , Empowering Tomorrow

          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {IMPACT.map((it, idx) => (

              <div
                key={it.title}
                className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center flex flex-col items-center justify-start h-full card-elev ${
                  idx === IMPACT.length - 1 ? "sm:col-span-2 lg:col-span-1 sm:max-w-xs sm:mx-auto lg:max-w-none w-full" : ""
                }`}
              >

                <span className="mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand-dark">

                  <it.icon className="h-6 w-6" />

                </span>

                <p className="mt-3 font-head text-base font-semibold text-ink">
                  {it.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {it.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ===== ABOUT US ===== */}

      <section
        id="about"
        className="bg-white pt-8 pb-16"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div>

              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-dark">
                About Us
              </span>

              <h2 className="mt-2 font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                A mission-driven platform for the North-East
              </h2>

              <p className="mt-4 text-slate-600">
                NER SMART Logistics is built to solve the unique movement challenges of the North Eastern Region — steep terrain, monsoon landslides, seasonal floods and connectivity gaps. We unify AI risk prediction, smart routing and live tracking into one command platform so essential goods reach every corner reliably and safely.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="font-mono text-2xl font-bold text-brand-dark">
                    2026
                  </p>

                  <p className="text-xs text-slate-500">
                    Regional launch
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="font-mono text-2xl font-bold text-brand-dark">
                    8
                  </p>

                  <p className="text-xs text-slate-500">
                    NER states served
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-forest p-8 text-white">

              <h3 className="font-head text-lg font-bold">
                Our Vision
              </h3>

              <p className="mt-3 text-slate-300">
                A connected, resilient North-East where no delivery is delayed by terrain, weather or blind spots — powered by data, not guesswork.
              </p>

              <div className="mt-5 space-y-3">

                {[
                  "Reliability first — every convoy, every corridor",
                  "Safety for drivers and communities",
                  "Sustainable, efficient movement of essentials",
                ].map((t) => (

                  <p
                    key={t}
                    className="flex items-center gap-2 text-sm"
                  >

                    <ShieldCheck className="h-4 w-4 text-brand" />

                    {t}

                  </p>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===== CONTACT ===== */}

      <section
        id="contact"
        className="bg-slate-50 py-16"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-2">

            <div>

              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-dark">
                Contact
              </span>

              <h2 className="mt-2 font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Get in touch
              </h2>

              <p className="mt-3 text-slate-600">
                Reach the NER SMART command team for onboarding, partnerships or a live walkthrough.
              </p>

              <div className="mt-6 space-y-3">

                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "command@nersmart.demo",
                  },
                  {
                    icon: RadioTower,
                    label: "Control Room",
                    value: "1070 · NDRF · BRO",
                  },
                  {
                    icon: MapPin,
                    label: "Headquarters",
                    value: "Guwahati, Assam",
                  },
                ].map((c) => (

                  <div
                    key={c.label}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 card-elev"
                  >

                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand-dark">

                      <c.icon className="h-5 w-5" />

                    </span>

                    <div>

                      <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {c.label}
                      </p>

                      <p className="text-sm font-semibold text-ink">
                        {c.value}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <ContactForm />

          </div>

        </div>

      </section>

      {/* ===== FINAL CTA ===== */}

      <section
        id="cta"
        className="relative overflow-hidden"
      >

        <img
          src={IMG.cta}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-forest-deep/90" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">

          <h2 className="font-head text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to Transform NER Logistics?
          </h2>

          <p className="mt-3 text-slate-300">
            Join NER SMART and move towards smarter, safer and sustainable logistics.
          </p>

          <Link to="/login" className="inline-block">

            <Button
              size="lg"
              data-testid="cta-getstarted-btn"
              className="mt-7 gap-2 bg-brand font-semibold text-ink hover:bg-brand-light"
            >

              Get Started Now

              <ArrowRight className="h-4 w-4" />

            </Button>

          </Link>

        </div>

      </section>

      {/* ===== FOOTER ===== */}

      <footer className="bg-ink py-12 text-slate-400">

        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

          <div className="sm:col-span-2 lg:col-span-2">

            <Brand dark />

            <p className="mt-4 max-w-sm text-sm">
              AI-powered logistics platform for a connected, reliable and resilient North-East.
            </p>

          </div>

          <FooterCol
            title="Platform"
            links={[
              "Dashboard",
              "Live Tracking",
              "Route Optimization",
              "Risk Prediction",
            ]}
          />

          <FooterCol
            title="Solutions"
            links={[
              "Transportation",
              "Risk Management",
              "Fleet Management",
              "Analytics",
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              "About Us",
              "Careers",
              "Contact Us",
              "Privacy Policy",
            ]}
          />

        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-4 pt-6 sm:flex-row sm:px-6 lg:px-8">

          <p className="text-xs">
            © 2026 NER SMART Logistics · AI-powered logistics for the North-East.
          </p>

          <div className="flex items-center gap-2">

            {[
              { label: "LinkedIn", Icon: Linkedin },
              { label: "Twitter", Icon: Twitter },
              { label: "YouTube", Icon: Youtube },
              { label: "GitHub", Icon: Github },
              { label: "Email", Icon: Mail },
            ].map(({ label, Icon }) => (

              <a
                key={label}
                href="#home"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition-colors hover:bg-brand hover:text-ink"
              >

                <Icon className="h-4 w-4" />

              </a>

            ))}

          </div>

        </div>

      </footer>

      {/* Product walkthrough video modal */}

      <Dialog
        open={showDemo}
        onOpenChange={setShowDemo}
      >

        <DialogContent
          data-testid="demo-video-modal"
          aria-describedby={undefined}
          className="max-w-3xl overflow-hidden p-0"
        >

          <DialogTitle className="sr-only">
            NER SMART Product Walkthrough
          </DialogTitle>

          <div className="relative aspect-video w-full bg-ink">

            {showDemo && (

              <video
                data-testid="demo-video"
                src={DEMO_VIDEO}
                poster={IMG.hero}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />

            )}

          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-3">

            <div>

              <p className="font-head text-sm font-bold text-ink">
                NER SMART — Product Walkthrough
              </p>

              <p className="text-xs text-slate-500">
                Plan → AI Analyze → Optimize → Track → Deliver Safe
              </p>

            </div>

            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-dark">

              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />

              Demo Reel

            </span>

          </div>

        </DialogContent>

      </Dialog>

    </div>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 card-elev ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      toast.error(
        "Please fill in name, email and message."
      );
      return;
    }

    if (
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(
        form.email
      )
    ) {
      toast.error(
        "Please enter a valid email address."
      );
      return;
    }

    const saved = JSON.parse(
      localStorage.getItem("ner_contact_msgs") ||
        "[]"
    );

    saved.unshift({
      ...form,
      at: new Date().toISOString(),
    });

    localStorage.setItem(
      "ner_contact_msgs",
      JSON.stringify(saved)
    );

    setSent(true);

    toast.success(
      "Message sent — our team will get back to you shortly."
    );

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  if (sent) {
    return (
      <div
        data-testid="contact-success"
        className="flex flex-col items-center justify-center rounded-2xl border border-brand/30 bg-white p-8 text-center card-elev"
      >

        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand-dark">

          <CheckCircle2 className="h-8 w-8" />

        </span>

        <h3 className="mt-4 font-head text-lg font-bold text-ink">
          Thank you!
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Your message has been received. We'll be in touch soon.
        </p>

        <button
          onClick={() => setSent(false)}
          data-testid="contact-send-another"
          className="mt-4 text-sm font-semibold text-brand-dark hover:underline"
        >
          Send another message
        </button>

      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      data-testid="contact-form"
      className="rounded-2xl border border-slate-200 bg-white p-6 card-elev"
    >

      <div className="grid gap-4 sm:grid-cols-2">

        <div>

          <label className="block text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            data-testid="contact-name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Your name"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

        </div>

        <div>

          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            data-testid="contact-email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

        </div>

      </div>

      <div className="mt-4">

        <label className="block text-sm font-medium text-slate-700">
          Message
        </label>

        <textarea
          data-testid="contact-message"
          value={form.message}
          onChange={(e) =>
            setForm({
              ...form,
              message: e.target.value,
            })
          }
          rows={4}
          placeholder="How can we help?"
          className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />

      </div>

      <Button
        type="submit"
        data-testid="contact-submit"
        className="mt-4 w-full gap-2 bg-brand font-semibold text-ink hover:bg-brand-dark hover:text-white"
      >

        Send Message

        <ArrowRight className="h-4 w-4" />

      </Button>

    </form>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>

      <p className="font-head text-sm font-semibold text-white">
        {title}
      </p>

      <ul className="mt-3 space-y-2 text-sm">

        {links.map((l) => (

          <li key={l}>

            <Link
              to="/login"
              className="transition-colors hover:text-brand"
            >
              {l}
            </Link>

          </li>

        ))}

      </ul>

    </div>
  );
}