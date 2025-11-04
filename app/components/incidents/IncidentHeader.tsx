"use client";

import { MapPin, Clock } from "lucide-react";

export default function IncidentHeader({ incident }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      {/* Left block: back link, title, badges, meta */}
      <div className="flex-1 min-w-0">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title + badges column */}
          <div className="min-w-0">
            <h1 className="text-[22px] font-semibold text-[#0b2c64] leading-tight">
              {incident.title}
            </h1>

            {/* Badges */}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {/* severity (blue pill) */}
              <span className="inline-flex items-center text-white bg-[#0b2c64] text-xs font-semibold px-3 py-1 rounded-full">
                {incident.severity}
              </span>

              {/* status (light pill) */}
              <span
                className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                  incident.status === "IN-PROGRESS"
                    ? "bg-[#fff8e6] text-[#8a6d1c] border border-[#f5e8c5]"
                    : "bg-[#e6f4ea] text-[#0b6a3a] border border-[#cfead0]"
                }`}
              >
                {incident.status}
              </span>

              {/* SLA BREACH */}
              {incident.slaBreach && (
                <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-[#dc3545] text-white">
                  SLA BREACH
                </span>
              )}
            </div>

            {/* location + timestamp */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 mt-3 gap-4">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-gray-500" />
                <span>{incident.location}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={14} className="text-gray-500" />
                <span>{incident.timestamp}</span>
              </div>
            </div>
          </div>

          {/* On very wide screens we keep the right block (kiosk) aligned to top */}
          {/* This spacer prevents the right kiosk area from pushing badges down on narrow screens */}
          <div className="hidden sm:block sm:flex-1" />
        </div>
      </div>

      {/* Right block: kiosk info aligned top-right */}
      <div className="text-right min-w-[180px]">
        <p className="text-sm text-gray-500">Kiosk ID</p>
        <p className="text-[#0b2c64] font-semibold">{incident.kiosk}</p>
        <p className="text-sm text-gray-500">Platform {incident.platform} - Emergency Tab</p>
      </div>
    </div>
  );
}
