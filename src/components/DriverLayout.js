import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Brand } from "@/components/Brand";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { NotificationPanel } from "@/components/NotificationPanel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  LayoutGrid, Navigation, Truck, Briefcase, Bell, ClipboardList, Siren, User,
  Map, Menu, X, LogOut, Signal,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV = [
  { to: "/app", end: true, label: "Dashboard", icon: LayoutGrid },
  { to: "/app/plan", label: "Plan Route", icon: Navigation },
  { to: "/app/tracking", label: "Live Tracking", icon: Truck },
  { to: "/app/map", label: "Network Map", icon: Map },
  { to: "/app/trips", label: "My Trips", icon: Briefcase },
  { to: "/app/alerts", label: "Alerts", icon: Bell },
  { to: "/app/report", label: "Report Incident", icon: ClipboardList },
];

function SidebarContent({ onNavigate }) {
  const { auth, logout, emergencyMode, setEmergencyMode } = useApp();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Brand dark />
        <p className="mt-1 pl-12 text-[9px] font-mono uppercase tracking-[0.2em] text-brand">Secure Logistics</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-brand text-ink" : "text-slate-300 hover:bg-white/5 hover:text-white"
            )} data-testid={`nav-${n.label.toLowerCase().replace(/ /g, "-")}`}>
            <n.icon className="h-4 w-4" /> {n.label}
          </NavLink>
        ))}
        <NavLink
          to="/app/emergency"
          onClick={onNavigate}
          data-testid="emergency-sos-nav"
          className={({ isActive }) => cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
            isActive
              ? "bg-red-600 text-white ring-2 ring-red-400/80 shadow-md shadow-red-950/50"
              : emergencyMode
                ? "bg-red-600 text-white animate-pulse"
                : "bg-red-600/90 text-white hover:bg-red-600"
          )}
        >
          <Siren className="h-4 w-4" />
          <span>Emergency SOS</span>
          {emergencyMode && (
            <span className="ml-auto rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Active
            </span>
          )}
        </NavLink>
        <NavLink to="/app/profile" onClick={onNavigate}
          className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-brand text-ink" : "text-slate-300 hover:bg-white/5 hover:text-white")} data-testid="nav-profile">
          <User className="h-4 w-4" /> Profile
        </NavLink>
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><Signal className="h-3.5 w-3.5 text-brand" /> Network: Good (VHF Active)</p>
        <div className="mt-3 flex items-center gap-3">
          <img src="https://i.pravatar.cc/80?img=13" alt="driver" className="h-9 w-9 rounded-full object-cover ring-2 ring-brand/40" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Pradeep Sangma</p>
            <p className="truncate text-[10px] text-slate-400">Essential Carrier · Guwahati</p>
          </div>
          <button data-testid="logout-btn" onClick={() => { logout(); navigate("/login"); }} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}

export function DriverLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-forest-deep lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 26 }} className="fixed inset-y-0 left-0 z-50 w-64 bg-forest-deep lg:hidden">
              <button className="absolute right-3 top-4 text-slate-300" onClick={() => setOpen(false)}><X className="h-6 w-6" /></button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur">
          <button className="lg:hidden" onClick={() => setOpen(true)} data-testid="mobile-menu-btn"><Menu className="h-6 w-6 text-ink" /></button>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="font-head text-sm font-semibold text-ink">Driver Command Console</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 sm:flex"><Signal className="h-3.5 w-3.5 text-brand" /> Live Operations</span>
            <NotificationPanel role="user" />
          </div>
        </div>

        <EmergencyBanner />
        <main className="px-4 pb-10 pt-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
