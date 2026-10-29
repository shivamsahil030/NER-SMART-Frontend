import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TRIPS as DEFAULT_TRIPS } from "@/data/mockData";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { History, Eye, MapPin, Package, Calendar, Route } from "lucide-react";

const statusTone = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  "In Transit": "bg-blue-50 text-blue-700 border-blue-200",
  "On Schedule": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function MyTrips() {
  const { trips } = useApp();
  const [detail, setDetail] = useState(null);
  const tripList = trips && trips.length > 0 ? trips : DEFAULT_TRIPS;

  return (
    <div className="space-y-6" data-testid="my-trips-page">
      <div>
        <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">My Trips</h1>
        <p className="text-sm text-slate-500">History of your dispatched convoys and delivery outcomes.</p>
      </div>

      <DashboardCard title="Trip History" icon={History} testId="trip-history-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Trip ID", "Source", "Destination", "Goods", "Date", "Route", "Status", "Delay", ""].map((h) => (
                  <TableHead key={h} className="whitespace-nowrap font-mono text-xs uppercase tracking-wider text-slate-400">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tripList.map((t) => (
                <TableRow key={t.id} data-testid={`trip-row-${t.id}`}>
                  <TableCell className="font-mono font-semibold text-slate-900">{t.id}</TableCell>
                  <TableCell>{t.source}</TableCell>
                  <TableCell>{t.dest}</TableCell>
                  <TableCell>{t.goods}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-500">{t.date}</TableCell>
                  <TableCell className="font-mono text-sm">{t.route}</TableCell>
                  <TableCell><span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase", statusTone[t.status])}>{t.status}</span></TableCell>
                  <TableCell className="text-slate-500">{t.delay}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="gap-1 text-navy-accent" data-testid={`view-trip-${t.id}`} onClick={() => setDetail(t)}>
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent data-testid="trip-detail-modal">
          <DialogHeader><DialogTitle className="font-head">Trip {detail?.id}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3">
              <D icon={MapPin} label="Route" value={`${detail.source} → ${detail.dest}`} />
              <D icon={Route} label="Corridor" value={detail.route} />
              <D icon={Package} label="Goods" value={detail.goods} />
              <D icon={Calendar} label="Date" value={detail.date} />
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="text-slate-400">Status</span>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase", statusTone[detail.status])}>{detail.status}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="text-slate-400">Delay</span><span className="font-semibold text-slate-800">{detail.delay}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function D({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
      <span className="flex items-center gap-2 text-slate-400"><Icon className="h-4 w-4" />{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
