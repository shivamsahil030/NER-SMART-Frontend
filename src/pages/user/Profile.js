import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, MapPin, Bell, Truck, LogOut, Map, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { auth, logout, resetDemo } = useApp();
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("ner_mapbox_token") || "");

  const saveToken = () => {
    if (token.trim()) {
      localStorage.setItem("ner_mapbox_token", token.trim());
      toast.success("Mapbox token saved — real map enabled. Reloading map views…");
    } else {
      localStorage.removeItem("ner_mapbox_token");
      toast.info("Mapbox token cleared — using built-in map.");
    }
    setTimeout(() => window.location.reload(), 900);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6" data-testid="profile-page">
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight text-ink sm:text-3xl">Profile & Settings</h1>
        <p className="text-sm text-slate-500">Manage your driver account, map and notification preferences.</p>
      </div>

      <DashboardCard title="Driver Profile" icon={User}>
        <div className="flex items-center gap-4">
          <img src="https://i.pravatar.cc/96?img=13" alt="driver" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-brand/40" />
          <div>
            <p className="font-head text-lg font-semibold text-slate-900">{auth?.name || "Pradeep Sangma"}</p>
            <p className="text-sm text-slate-500">{auth?.email || "user@nersmart.demo"}</p>
            <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase text-brand-dark">Active · Guwahati Region</span>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field icon={Mail} label="Email" value={auth?.email || "user@nersmart.demo"} />
          <Field icon={Phone} label="Mobile" value="+91 98XXX XXXXX" />
          <Field icon={MapPin} label="Base Hub" value="Guwahati Inland Depot" />
          <Field icon={Truck} label="Fleet Assigned" value="NER-TRUCK-101 / 102" />
        </div>
      </DashboardCard>

      <DashboardCard title="Map Settings" icon={Map}>
        <Label className="text-slate-600">Mapbox Access Token</Label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <Input data-testid="mapbox-token-input" value={token} onChange={(e) => setToken(e.target.value)} placeholder="pk.eyJ1Ijoi… (paste your Mapbox token)" className="font-mono text-sm" />
          <Button onClick={saveToken} data-testid="save-token-btn" className="shrink-0 bg-brand font-semibold text-ink hover:bg-brand-dark hover:text-white">Save & Enable</Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Leave empty to use the built-in map. When a valid token is added, all map views switch to a real interactive Mapbox map.
          Get a free token at <span className="font-mono text-brand-dark">mapbox.com/account/access-tokens</span>.
        </p>
      </DashboardCard>

      <DashboardCard title="Notifications" icon={Bell}>
        <div className="space-y-3">
          {["Road blockage alerts", "Weather advisories", "Convoy delay notifications", "Emergency broadcasts"].map((n, i) => (
            <div key={n} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="text-sm text-slate-700">{n}</span>
              <Switch defaultChecked={i !== 2} data-testid={`notif-toggle-${i}`} />
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Data Controls" icon={RotateCcw} accent="caution">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Road blocks, field reports and alerts are saved across refreshes. Reset to restore the original data.</p>
          <Button variant="outline" className="shrink-0 gap-2 border-red-200 text-red-600 hover:bg-red-50" data-testid="reset-demo-btn"
            onClick={() => { resetDemo(); toast.success("Data reset to defaults."); }}>
            <RotateCcw className="h-4 w-4" /> Reset Data
          </Button>
        </div>
      </DashboardCard>

      <Button variant="outline" className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50" data-testid="profile-logout"
        onClick={() => { logout(); toast.success("Signed out."); navigate("/login"); }}>
        <LogOut className="h-4 w-4" /> Sign Out
      </Button>
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div>
      <Label className="flex items-center gap-1.5 text-slate-500"><Icon className="h-3.5 w-3.5" />{label}</Label>
      <Input value={value} readOnly className="mt-1.5 bg-slate-50" />
    </div>
  );
}
