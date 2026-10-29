import React from "react";
import { CloudRain, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react";

export function WeatherCard({ weather, testId = "weather-card" }) {
  return (
    <div data-testid={testId} className="card-elev overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between bg-gradient-to-r from-navy to-navy-command px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <CloudRain className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide font-mono">Weather · NER</span>
        </div>
        <span className="text-xs text-blue-100">{weather.condition}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
        <WItem icon={Droplets} label="Rainfall" value={`${weather.rainfall} mm`} />
        <WItem icon={Thermometer} label="Temp" value={`${weather.temperature}°C`} />
        <WItem icon={Droplets} label="Humidity" value={`${weather.humidity}%`} />
        <WItem icon={Wind} label="Wind" value={`${weather.wind} km/h`} />
      </div>
      <div className="mx-5 mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{weather.warning}</span>
      </div>
    </div>
  );
}
function WItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-5 w-5 text-navy-command" />
      <p className="mt-1 font-mono text-lg font-bold text-slate-900">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}
