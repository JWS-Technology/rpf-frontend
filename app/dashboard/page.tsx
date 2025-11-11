"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import TopBar from "../components/dashboard-componets/TopBar";
import FilterPanel from "../components/dashboard-componets/FilterPanel";
import IncidentList from "../components/dashboard-componets/IncidentList";
import { LayoutGrid, List, Download, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { exportIncidentsAsPDF, exportIncidentsAsExcel } from "@/lib/exportIncidents";

type IncidentType = {
  _id?: string;
  id?: string; // if you use separate id
  issue_type?: string;
  type?: string;
  description?: string;
  station?: string;
  status?: string;
  officer?: string;
  date?: string;
  phone_number?: string;
  audio_url?: string;
  createdAt?: string;
  // add other fields you store
};

export default function DashboardPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [incidentCount, setIncidentCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState("All Stations");
  const [filters, setFilters] = useState({
    station: "All Stations",
    priority: "All Priorities",
    status: "All Statuses",
    type: "",
    time: "Last 24 hours",
  });

  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // NEW: fetched incidents
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FETCH incidents from server
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/incident-list");
        if (!res.ok) {
          throw new Error(`Failed to fetch incidents (status ${res.status})`);
        }
        const data = await res.json();
        // Expecting { incidents: [...] } from your GET handler
        if (mounted) {
          setIncidents(data.incidents || []);
        }
      } catch (err: any) {
        console.error("Error fetching incidents:", err);
        if (mounted) setError(err.message || "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    // optional: poll every 30s (uncomment if you want automatic refresh)
    // const id = setInterval(load, 30000);
    // return () => { mounted = false; clearInterval(id); };
    return () => { mounted = false; };
  }, []);

  // derive stations list for filter panel (optional)
  const stations = useMemo(() => {
    const s = new Set<string>();
    incidents.forEach((it) => {
      if (it.station) s.add(it.station);
    });
    return ["All Stations", ...Array.from(s)];
  }, [incidents]);

  // 🔹 Filter logic (same as before but based on fetched incidents)
  // inside DashboardPage component — replace existing filteredIncidents useMemo
  // replace existing filteredIncidents useMemo with this improved version
  const filteredIncidents = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();

    // normalized priority map
    const priorityMap: Record<string, string> = {
      panic: "High",
      theft: "High",
      harassment: "High",
      suspicious: "Medium",
      lost: "Low",
      security: "Low",
    };

    // helper normalizer
    const norm = (v?: any) => (v ?? "").toString().trim();

    return incidents.filter((i) => {
      const idStr = norm(i.id ?? i._id).toLowerCase();
      // combine both possible type fields and normalize
      const typeRaw = (i.type ?? i.issue_type ?? "").toString().trim();
      const typeStr = typeRaw.toLowerCase();
      const descStr = norm(i.description).toLowerCase();
      const stationStr = norm(i.station);
      const incidentStatus = norm(i.status).toLowerCase();

      // search: if query exists, check id / type / description
      const matchesSearch = !q || idStr.includes(q) || typeStr.includes(q) || descStr.includes(q);

      // station: respected if selectedStation or filters.station !== "All Stations"
      const matchesStation =
        selectedStation === "All Stations" ||
        (filters.station && filters.station !== "All Stations" && stationStr === filters.station) ||
        (selectedStation !== "All Stations" && stationStr === selectedStation);

      // TYPE filter:
      // - if filters.type empty -> allow all
      // - otherwise accept exact match OR partial contains (so 'lost' matches 'lost' and 'lost item' etc.)
      const chosenType = (filters.type ?? "").toString().trim().toLowerCase();
      const matchesType =
        !chosenType ||
        typeStr === chosenType ||
        typeStr.includes(chosenType) ||
        // if the incident has other fields that include type words, you can extend here
        false;

      // STATUS filter: support "All Statuses" and case-insensitive equality
      const chosenStatus = (filters.status ?? "").toString().trim().toLowerCase();
      const matchesStatus =
        !chosenStatus ||
        chosenStatus === "all statuses" ||
        incidentStatus === chosenStatus ||
        // also accept human-friendly variations (e.g., "in progress" vs "in-progress")
        (incidentStatus.replace(/\s+/g, "-") === chosenStatus.replace(/\s+/g, "-"));

      // PRIORITY filter: map incident type -> priority; allow All Priorities
      const incidentPriority = (priorityMap[typeStr] ?? "Low").toString().toLowerCase();
      const chosenPriority = (filters.priority ?? "").toString().trim().toLowerCase();
      const matchesPriority =
        !chosenPriority ||
        chosenPriority === "all priorities" ||
        incidentPriority === chosenPriority;

      // final
      const keep = matchesSearch && matchesStation && matchesType && matchesStatus && matchesPriority;

      // debug (uncomment when troubleshooting a specific case)
      // console.debug("filter check:", { id: i.id ?? i._id, typeRaw, typeStr, chosenType, matchesType, incidentStatus, chosenStatus, incidentPriority, chosenPriority, keep });

      return keep;
    });
  }, [incidents, searchQuery, selectedStation, filters]);

  // keep incidentCount sync with filteredIncidents (or total incidents)
  useEffect(() => {
    setIncidentCount(filteredIncidents.length);
  }, [filteredIncidents]);

  // 🔹 Status Summary
  const statusSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    filteredIncidents.forEach((incident) => {
      const status = (incident.status || "UNKNOWN").toUpperCase();
      summary[status] = (summary[status] || 0) + 1;
    });
    return summary;
  }, [filteredIncidents]);



  return (
    <div className="bg-[#f5f8fa] min-h-screen overflow-x-hidden">
      <TopBar onSearch={setSearchQuery} onStationSelect={(s) => setSelectedStation(s)} />

      {/* ===== Header Section ===== */}
      <div className="px-4 sm:px-6 md:px-10 py-4 border-b border-gray-200 bg-[#f5f8fa]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-[#0b2c64]">All Incidents</h1>
              <p className="text-sm text-[#4a5a73] mt-1">
                Showing {incidentCount} {incidentCount === 1 ? "incident" : "incidents"}
              </p>
            </div>

            {/* Status Summary */}
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(statusSummary).map(([status, count]) => {
                const colorMap: Record<string, string> = {
                  OPEN: "bg-red-100 text-red-700 border-red-200",
                  "IN-PROGRESS": "bg-yellow-100 text-yellow-700 border-yellow-200",
                  ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
                  RESOLVED: "bg-green-100 text-green-700 border-green-200",
                  CLOSED: "bg-gray-100 text-gray-700 border-gray-200",
                };
                const colorClass =
                  colorMap[status.toUpperCase()] ||
                  "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div
                    key={status}
                    className={`min-w-[90px] border ${colorClass} rounded-lg shadow-sm px-3 py-2 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]`}
                  >
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">
                      {status}
                    </p>
                    <p className="text-base sm:text-lg font-bold">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-[#0b2c64] font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition"
            >
              <Download size={18} />
              Export
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${exportOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {exportOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-44 z-20 animate-fadeIn">
                <ul className="text-sm text-gray-700">
                  <li
                    onClick={() => {
                      exportIncidentsAsPDF(filteredIncidents as any[]); // cast if necessary
                      setExportOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-md"
                  >
                    Export as PDF
                  </li>
                  <li
                    onClick={() => {
                      exportIncidentsAsExcel(filteredIncidents as any[]);
                      setExportOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-b-md"
                  >
                    Export as Excel
                  </li>
                </ul>
              </div>
            )}

            <button
              onClick={() => setView("grid")}
              className={`p-3 rounded-xl shadow-md transition ${view === "grid"
                ? "bg-[#0b2c64] text-white hover:bg-[#09305f]"
                : "bg-white border border-gray-200 text-[#0b2c64] hover:bg-gray-50"
                }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-3 rounded-xl shadow-md transition ${view === "list"
                ? "bg-[#0b2c64] text-white hover:bg-[#09305f]"
                : "bg-white border border-gray-200 text-[#0b2c64] hover:bg-gray-50"
                }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      {/* ===== Main Content ===== */}
      <div className="px-4 sm:px-6 md:px-10 py-6 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
        <div className="w-full lg:w-72 shrink-0">
          <FilterPanel
            filters={filters}
            onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
            stations={stations}
          />
        </div>

        <section className="flex-1 ml-2">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading incidents…</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">Error: {error}</div>
          ) : filteredIncidents.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-gray-200 rounded-lg bg-white shadow-sm">
              <p className="text-lg font-semibold text-[#0b2c64] mb-2">
                No records found{filters.type ? ` for "${filters.type}"` : ""}.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Try clearing filters or change your search to see results.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() =>
                    setFilters({
                      station: "All Stations",
                      priority: "All Priorities",
                      status: "All Statuses",
                      type: "",
                      time: "Last 24 hours",
                    })
                  }
                  className="px-4 py-2 bg-[#0b2c64] text-white rounded-md hover:bg-[#09305f] transition"
                >
                  Reset filters
                </button>

                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 border rounded-md text-[#0b2c64] hover:bg-gray-50 transition"
                >
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            <IncidentList view={view} onDataLoaded={setIncidentCount} incidentsData={filteredIncidents} />
          )}
        </section>
      </div>

    </div>
  );
}
