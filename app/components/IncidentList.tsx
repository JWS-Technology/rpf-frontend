"use client";
import { useEffect } from "react";
import IncidentCard from "./IncidentCard";

export const incidents = [
  {
    id: "RPF-2025-0001",
    type: "Panic",
    description: "Passenger pressed panic button near platform 2.",
    station: "Coimbatore Junction",
    date: "5 days ago",
    status: "OPEN",
  },
  {
    id: "RPF-2025-0002",
    type: "Theft",
    description: "Luggage theft reported near waiting hall.",
    station: "Chennai Central",
    date: "5 days ago",
    status: "ASSIGNED",
    officer: "SI Ramesh Kumar",
  },
  {
    id: "RPF-2025-0003",
    type: "Harassment",
    description: "Female passenger reports harassment by group of men.",
    station: "New Delhi",
    date: "5 days ago",
    status: "IN-PROGRESS",
    officer: "HC Priya Sharma",
  },
  {
    id: "RPF-2025-0004",
    type: "Suspicious",
    description: "Unattended bag spotted near waiting area.",
    station: "Howrah Junction",
    date: "5 days ago",
    status: "OPEN",
    officer: "SI Arun Ghosh",
  },
   {
    id: "RPF-2025-0005",
    type: "Lost ",
    description: "Unattended bag spotted near waiting area.",
    station: "Howrah Junction",
    date: "6 days ago",
    status: "OPEN",
    officer: "SI Arun Ghosh",
  },
  {
    id: "RPF-2025-0006",
    type: "Security Threat",
    description: "Unattended bag spotted near waiting area.",
    station: "pudukottai",
    date: "6 days ago",
    status: "closed",
    officer: "SI Arun Ghosh",
  },
];

interface IncidentListProps {
  view: "grid" | "list";
  onDataLoaded?: (count: number) => void;
  incidentsData?: typeof incidents;
}

export default function IncidentList({
  view,
  onDataLoaded,
  incidentsData,
}: IncidentListProps) {
  const data = incidentsData || incidents;

  useEffect(() => {
    if (onDataLoaded) onDataLoaded(data.length);
  }, [data, onDataLoaded]);

  const getPriority = (type: string) => {
    if (type === "Panic") return "emergency";
    if (type === "Theft" || type === "Harassment") return "high";
    if (type === "Suspicious") return "medium";
    return "low";
  };

  const priorityColors: Record<string, string> = {
    emergency: "bg-[#dc3545] text-white",
    high: "bg-[#0b2c64] text-white",
    medium: "bg-[#224b9e] text-white",
    low: "bg-[#617fa3] text-white",
  };

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center text-gray-500 font-medium">
        No incidents found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {view === "grid" ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#0b2c64]">
              Incidents Table
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f9fafb] text-[#0b2c64]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Station</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-[#334155]">
                {data.map((incident) => (
                  <tr key={incident.id} className="hover:bg-[#f8fafc] transition">
                    <td className="px-6 py-4 font-semibold text-[#0b2c64]">{incident.id}</td>
                    <td className="px-6 py-4">{incident.type}</td>
                    <td className="px-6 py-4">{incident.station}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          priorityColors[getPriority(incident.type)]
                        }`}
                      >
                        {getPriority(incident.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {incident.status.toLowerCase()}
                    </td>
                    <td className="px-6 py-4">
                      {incident.officer ? incident.officer : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
