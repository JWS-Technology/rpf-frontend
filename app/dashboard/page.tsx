"use client";

import { useState } from "react";
import TopBar from "../components/TopBar";
import FilterPanel from "../components/FilterPanel";
import IncidentList from "../components/IncidentList";
import { LayoutGrid, List, Download } from "lucide-react";

export default function IncidentsPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [incidentCount, setIncidentCount] = useState<number>(0);

  return (
    <div className="bg-[#f5f8fa] min-h-screen overflow-x-hidden">
      <TopBar />

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-10 py-6 border-b border-gray-200 bg-[#f5f8fa]">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-[#0b2c64]">All Incidents</h1>
          <p className="text-sm text-[#4a5a73] mt-1">
            Showing {incidentCount} {incidentCount === 1 ? "incident" : "incidents"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* Dummy Export UI */}
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#0b2c64] font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition">
            <Download size={18} />
            Export
          </button>

          {/* Grid View */}
          <button
            onClick={() => setView("grid")}
            className={`p-3 rounded-xl shadow-md transition ${
              view === "grid"
                ? "bg-[#0b2c64] text-white hover:bg-[#09305f]"
                : "bg-white border border-gray-200 text-[#0b2c64] hover:bg-gray-50"
            }`}
          >
            <LayoutGrid size={18} />
          </button>

          {/* List View */}
          <button
            onClick={() => setView("list")}
            className={`p-3 rounded-xl shadow-md transition ${
              view === "list"
                ? "bg-[#0b2c64] text-white hover:bg-[#09305f]"
                : "bg-white border border-gray-200 text-[#0b2c64] hover:bg-gray-50"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="px-4 sm:px-6 md:px-10 py-6 flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <div className="w-full lg:w-1/4">
          <FilterPanel />
        </div>

        {/* Incident List */}
        <div className="w-full lg:flex-1">
          <IncidentList view={view} onDataLoaded={(count) => setIncidentCount(count)} />
        </div>
      </div>
    </div>
  );
}
