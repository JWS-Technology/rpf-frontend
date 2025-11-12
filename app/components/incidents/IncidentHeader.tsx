"use client";

import { MapPin, Clock, AlertTriangle } from "lucide-react";

export default function IncidentHeader({ incident }: any) {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* LEFT SECTION */}
        <div className="flex-1 min-w-0">
          {/* Title and Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-[#0b2c64] leading-snug truncate">
                {incident.title || "Untitled Incident"}
              </h1>

              {/* Badges Row */}
              <div className="flex items-center flex-wrap gap-2 mt-2">
                {/* Severity */}
                <span className="inline-flex items-center text-white bg-[#0b2c64] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  <AlertTriangle size={12} className="mr-1 opacity-80" />
                  {incident.severity || "N/A"}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${
                    incident.status === "IN-PROGRESS"
                      ? "bg-[#fff8e6] text-[#8a6d1c] border-[#f5e8c5]"
                      : incident.status === "CLOSED"
                      ? "bg-[#e6f4ea] text-[#0b6a3a] border-[#cfead0]"
                      : "bg-[#e8effc] text-[#0b2c64] border-[#c8d9fa]"
                  }`}
                >
                  {incident.status || "Unknown"}
                </span>

                {/* SLA Breach */}
                {incident.slaBreach && (
                  <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-[#dc3545] text-white shadow-sm">
                    ⚠️ SLA BREACH
                  </span>
                )}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center text-sm text-gray-600 mt-3 gap-x-6 gap-y-2">
                {incident.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-500" />
                    <span className="truncate">{incident.location}</span>
                  </div>
                )}

                {incident.timestamp && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-500" />
                    <span>{incident.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (Kiosk Info) */}
        <div className="bg-[#f8fafc] rounded-xl p-4 text-right min-w-[200px] border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Kiosk ID</p>
          <p className="text-[#0b2c64] font-semibold text-lg">
            {incident.kiosk || "—"}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Platform {incident.platform || "?"} • Emergency Tab
          </p>
        </div>
      </div>
    </div>
  );
}
