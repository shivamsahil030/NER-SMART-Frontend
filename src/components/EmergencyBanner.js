import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyBanner() {
  const { emergencyMode, setEmergencyMode } = useApp();
  return (
    <AnimatePresence>
      {emergencyMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          data-testid="emergency-banner"
          className="overflow-hidden bg-red-600 text-white"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-wide font-head">
                State Monsoon Emergency Mode Active — priority routing enabled for medical, relief & ambulance convoys
              </p>
            </div>
            <button data-testid="emergency-banner-close" onClick={() => setEmergencyMode(false)} className="rounded p-1 hover:bg-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
