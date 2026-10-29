import React, { useState } from "react";
import axios from "axios";

import { useApp } from "@/context/AppContext";
import { INCIDENT_TYPES, PASSABILITY } from "@/data/mockData";

import { DashboardCard } from "@/components/DashboardCard";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  MapPin,
  Locate,
  CheckCircle2,
  Upload,
  AlertTriangle,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function FieldReport() {
  const { addIncident } = useApp();

  const [type, setType] = useState("Landslide");
  const [location, setLocation] = useState("");
  const [gps, setGps] = useState(null);

  const [passability, setPassability] = useState(
    PASSABILITY[0]
  );

  const [severity, setSeverity] = useState("critical");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);

  const [ticket, setTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /*
   * Capture GPS
   * Prototype currently uses simulated coordinates.
   */
  const captureGps = () => {
    const lat = (
      24 + Math.random() * 3.5
    ).toFixed(4);

    const lon = (
      91 + Math.random() * 3.5
    ).toFixed(4);

    const coordinates = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };

    setGps(coordinates);

    if (!location) {
      setLocation(
        "NH corridor near " + lat + ", " + lon
      );
    }

    toast.success(
      "GPS coordinates captured (simulated)."
    );
  };

  /*
   * Photo upload
   */
  const onPhoto = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));

      toast.success(
        "Photo attached."
      );
    }
  };

  /*
   * Submit Field Report
   *
   * Complete backend flow:
   *
   * Field Report
   *      ↓
   * Frontend Incident
   *      ↓
   * POST /events/
   *      ↓
   * POST /disruptions/
   *      ↓
   * Risk Engine can use active disruption
   */
  const submit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error(
        "Please capture GPS or enter a location."
      );
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);

    /*
     * Use captured GPS if available.
     * Otherwise generate demo coordinates.
     */
    const coords =
      gps || {
        lat: 25 + Math.random() * 2,
        lon: 92 + Math.random() * 2,
      };

    const description =
      desc ||
      (
        type +
        " reported - passability: " +
        passability
      );

    try {
      /*
       * STEP 1
       *
       * Save incident in frontend AppContext.
       *
       * This keeps the existing UI behaviour.
       */
      const incidentId = addIncident({
        type: type,
        location: location,
        severity: severity,
        description: description,

        lat: coords.lat,
        lon: coords.lon,

        photo: !!photo,
        passability: passability,
      });

      /*
       * STEP 2
       *
       * Send field event to backend.
       *
       * Endpoint:
       * POST /events/
       */
      const eventPayload = {
        shipmentId: "1",
        vehicleId: "V001",

        eventType:
          "FIELD_HAZARD_REPORTED",

        description:
          type +
          ": " +
          description +
          ". Passability: " +
          passability +
          ". Severity: " +
          severity +
          ". GPS: " +
          coords.lat +
          ", " +
          coords.lon,

        locationName: location,
      };

      const eventResponse =
        await axios.post(
          API_URL + "/events/",
          eventPayload
        );

      console.log(
        "NER SMART: Field event saved successfully",
        eventResponse.data
      );

      /*
       * STEP 3
       *
       * Convert field report into
       * an ACTIVE disruption.
       *
       * This allows the Risk Engine to
       * consider the reported hazard.
       */
      const disruptionSeverity =
        severity === "critical"
          ? "CRITICAL"
          : severity === "warning"
          ? "HIGH"
          : "LOW";

      const disruptionPayload = {
        location: location,

        type: type,

        severity:
          disruptionSeverity,

        status: "ACTIVE",

        description:
          description +
          ". Passability: " +
          passability,

        latitude: coords.lat,

        longitude: coords.lon,

        reportedBy:
          "Field Reporter",
      };

      const disruptionResponse =
        await axios.post(
          API_URL + "/disruptions/",
          disruptionPayload
        );

      console.log(
        "NER SMART: Disruption created successfully",
        disruptionResponse.data
      );

      /*
       * STEP 4
       *
       * Show success screen.
       */
      setTicket(incidentId);

      toast.success(
        "Incident successfully reported.",
        {
          description:
            "Hazard reported and disruption created.",
        }
      );

    } catch (error) {
      console.error(
        "NER SMART: Backend field report error",
        error
      );

      /*
       * Frontend incident was already saved
       * locally before backend request.
       *
       * Therefore prototype can continue
       * in demo mode if backend fails.
       */
      const demoId =
        "NER-HAZ-2026-" +
        Math.floor(
          1000 + Math.random() * 8999
        );

      setTicket(demoId);

      const backendMessage =
        error?.response?.data?.detail;

      toast.warning(
        "Incident saved in demo mode.",
        {
          description:
            backendMessage ||
            "Backend unavailable, but the report is visible locally.",
        }
      );

    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Reset form
   */
  const reset = () => {
    setTicket(null);

    setLocation("");
    setGps(null);

    setDesc("");
    setPhoto(null);

    setType("Landslide");

    setSeverity("critical");

    setPassability(
      PASSABILITY[0]
    );
  };

  /*
   * Success Screen
   */
  if (ticket) {
    return (
      <div
        className="mx-auto max-w-lg"
        data-testid="field-report-success"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="rounded-2xl border border-emerald-200 bg-white p-8 text-center card-elev"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </span>

          <h2 className="mt-4 font-head text-xl font-bold text-navy">
            Incident successfully reported
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your report is now visible on the
            command map and awaiting verification.
          </p>

          <p className="mt-4 rounded-lg bg-slate-50 py-3 font-mono text-sm font-semibold text-slate-700">
            Ref: {ticket}
          </p>

          <Button
            onClick={reset}
            className="mt-5 w-full bg-navy-command hover:bg-navy"
            data-testid="report-another-btn"
          >
            Report Another Incident
          </Button>
        </motion.div>
      </div>
    );
  }

  /*
   * Main Field Report Page
   */
  return (
    <div
      className="mx-auto max-w-2xl"
      data-testid="field-report-page"
    >
      <div className="mb-6">
        <h1 className="font-head text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Field Hazard Reporting
        </h1>

        <p className="text-sm text-slate-500">
          Ground reporters & citizens -
          submit geo-tagged road hazards.
          Offline-ready.
        </p>
      </div>

      <DashboardCard
        title="New Incident Report"
        icon={AlertTriangle}
        accent="caution"
      >
        <form
          onSubmit={submit}
          className="space-y-5"
        >
          {/* Incident Type */}

          <div>
            <Label className="text-slate-600">
              Incident Type
            </Label>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {INCIDENT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  data-testid={
                    "incident-type-" +
                    t
                      .toLowerCase()
                      .replace(/ /g, "-")
                  }
                  onClick={() =>
                    setType(t)
                  }
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",

                    type === t
                      ? "border-navy-command bg-navy-command text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Location + GPS */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-600">
                Location
              </Label>

              <Input
                data-testid="report-location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="e.g. NH-6 Jaintia Hills"
                className="mt-1.5"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={captureGps}
                data-testid="capture-gps-btn"
                className="w-full gap-2 border-navy-command text-navy-command hover:bg-navy-command hover:text-white"
              >
                <Locate className="h-4 w-4" />

                {gps
                  ? gps.lat +
                    ", " +
                    gps.lon
                  : "Capture GPS"}
              </Button>
            </div>
          </div>

          {/* Passability + Severity */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-600">
                Road Passability
              </Label>

              <Select
                value={passability}
                onValueChange={
                  setPassability
                }
              >
                <SelectTrigger
                  className="mt-1.5"
                  data-testid="passability-select"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {PASSABILITY.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                    >
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-600">
                Severity
              </Label>

              <Select
                value={severity}
                onValueChange={
                  setSeverity
                }
              >
                <SelectTrigger
                  className="mt-1.5"
                  data-testid="severity-select"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="critical">
                    Critical
                  </SelectItem>

                  <SelectItem value="warning">
                    Warning
                  </SelectItem>

                  <SelectItem value="info">
                    Information
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Photo / Video */}

          <div>
            <Label className="text-slate-600">
              Photo / Video Evidence
            </Label>

            <label
              data-testid="photo-upload-label"
              className="mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition-colors hover:border-navy-command"
            >
              {photo ? (
                <img
                  src={photo}
                  alt="evidence"
                  className="h-28 rounded-lg object-cover"
                />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-slate-400" />

                  <span className="text-sm text-slate-500">
                    Tap to upload photo
                    (optional video)
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={onPhoto}
                data-testid="photo-input"
              />
            </label>
          </div>

          {/* Description */}

          <div>
            <Label className="text-slate-600">
              Description
            </Label>

            <Textarea
              data-testid="report-description"
              value={desc}
              onChange={(e) =>
                setDesc(e.target.value)
              }
              placeholder="Describe the hazard, extent and any immediate risk…"
              className="mt-1.5 min-h-[90px]"
            />
          </div>

          {/* Submit Button */}

          <Button
            type="submit"
            disabled={submitting}
            data-testid="submit-incident-btn"
            className="w-full gap-2 bg-red-600 hover:bg-red-700"
          >
            <MapPin className="h-4 w-4" />

            {submitting
              ? "Submitting Incident..."
              : "Submit Incident"}
          </Button>
        </form>
      </DashboardCard>
    </div>
  );
}