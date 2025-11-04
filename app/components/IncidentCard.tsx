"use client";

import { MapPin, Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface IncidentProps {
  incident: {
    id: string;
    type: string;
    description: string;
    station: string;
    date: string;
    status: string;
    officer?: string;
    slaBreach?: boolean;
  };
}

export default function IncidentCard({ incident }: IncidentProps) {
  const router = useRouter();

  const statusStyles: Record<string, string> = {
    OPEN: "bg-[#fef2f2] text-[#c53030]",
    ASSIGNED: "bg-[#e3e9f9] text-[#0b2c64]",
    "IN-PROGRESS": "bg-[#fff6e6] text-[#a16207]",
    ACKNOWLEDGED: "bg-[#eef2f7] text-[#4b5563]",
    ESCALATED: "bg-[#e9e4ff] text-[#3c208b]",
    RESOLVED: "bg-[#e7f6ef] text-[#1b7a3a]",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 w-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-[#0b2c64]">
            {incident.id}
          </h3>
          {incident.slaBreach && (
            <span className="text-xs bg-[#d92d20] text-white px-2.5 py-0.5 rounded-full font-medium">
              SLA BREACH
            </span>
          )}
        </div>
        <div
          className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[incident.status]}`}
        >
          {incident.status}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-3">
        <div>
          <p className="text-[15px] text-[#0b2c64] font-semibold">
            {incident.type}
          </p>
          <p className="text-sm text-[#4a5a73] mt-1 leading-snug line-clamp-2">
            {incident.description}
          </p>
        </div>

        <div className="flex flex-col justify-center text-sm text-[#64748b] gap-1">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{incident.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{incident.station}</span>
          </div>
          {incident.officer && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{incident.officer}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-3">
        <button
  onClick={() => router.push(`/incidents/${incident.id}`)}
  className="bg-[#e8effc] text-[#0b2c64] py-2 rounded-xl font-medium text-sm hover:bg-[#dbe6fb] transition"
>
  View Details
</button>
        {(incident.status === "OPEN" || incident.status === "ACKNOWLEDGED") && (
          <button className="bg-[#0b2c64] text-white py-2 rounded-xl font-medium text-sm hover:bg-[#092659] transition">
            Assign
          </button>
        )}
      </div>
    </div>
  );
}
