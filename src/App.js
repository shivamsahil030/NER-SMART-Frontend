import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { DriverLayout } from "@/components/DriverLayout";
import { Toaster } from "@/components/ui/sonner";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";

import UserDashboard from "@/pages/user/UserDashboard";
import PlanRoute from "@/pages/user/PlanRoute";
import MyTrips from "@/pages/user/MyTrips";
import LiveTracking from "@/pages/user/LiveTracking";
import Alerts from "@/pages/user/Alerts";
import FieldReport from "@/pages/user/FieldReport";
import Profile from "@/pages/user/Profile";
import MapView from "@/pages/user/MapView";
import EmergencySOS from "@/pages/user/EmergencySOS";

function RequireAuth() {
  const { auth } = useApp();
  if (!auth) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function UserShell() {
  return <DriverLayout><Outlet /></DriverLayout>;
}

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            <Route element={<RequireAuth />}>
              <Route element={<UserShell />}>
                <Route path="/app" element={<UserDashboard />} />
                <Route path="/app/plan" element={<PlanRoute />} />
                <Route path="/app/tracking" element={<LiveTracking />} />
                <Route path="/app/map" element={<MapView />} />
                <Route path="/app/alerts" element={<Alerts />} />
                <Route path="/app/report" element={<FieldReport />} />
                <Route path="/app/trips" element={<MyTrips />} />
                <Route path="/app/emergency" element={<EmergencySOS />} />
                <Route path="/app/profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-center" offset={72} richColors />
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
