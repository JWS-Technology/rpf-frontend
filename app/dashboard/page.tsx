"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import TopBar from "../components/dashboard-componets/TopBar";
import FilterPanel from "../components/dashboard-componets/FilterPanel";
import IncidentList, { incidents } from "../components/dashboard-componets/IncidentList";
import { LayoutGrid, List, Download, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function DashboardPage() {
  const [view, setView] = useState<"grid" | "list">("list");
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

  // 🔹 Filter logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      const matchesSearch =
        i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStation =
        (selectedStation === "All Stations" || i.station === selectedStation) &&
        (filters.station === "All Stations" || i.station === filters.station);

      const matchesType =
        !filters.type || i.type.toLowerCase() === filters.type.toLowerCase();

      const matchesStatus =
        filters.status === "All Statuses" ||
        i.status.toLowerCase() === filters.status.toLowerCase();

      const priorityMap: Record<string, string> = {
        Panic: "High",
        Theft: "High",
        Harassment: "High",
        Suspicious: "Medium",
        Lost: "Low",
        Security: "Low",
      };

      const matchesPriority =
        filters.priority === "All Priorities" ||
        priorityMap[i.type] === filters.priority;

      return (
        matchesSearch &&
        matchesStation &&
        matchesType &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [searchQuery, selectedStation, filters]);

  // 🔹 Status Summary
  const statusSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    filteredIncidents.forEach((incident) => {
      const status = incident.status.toUpperCase();
      summary[status] = (summary[status] || 0) + 1;
    });
    return summary;
  }, [filteredIncidents]);

  // 🔹 Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF("p", "pt");
    doc.setFontSize(18);
    doc.setTextColor("#0b2c64");
    doc.text("Incident Report", 40, 40);

    doc.setFontSize(11);
    doc.text(`Total Incidents: ${filteredIncidents.length}`, 40, 60);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 80);

    const tableColumn = ["ID", "Type", "Station", "Status", "Officer", "Date"];
    const tableRows = filteredIncidents.map((i) => [
      i.id,
      i.type,
      i.station,
      i.status,
      i.officer || "-",
      i.date,
    ]);

    autoTable(doc, {
      startY: 100,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Incidents_Report.pdf");
  };

  // 🔹 Export Excel
  const handleExportExcel = () => {
    const worksheetData = filteredIncidents.map((i) => ({
      ID: i.id,
      Type: i.type,
      Station: i.station,
      Status: i.status,
      Officer: i.officer || "-",
      Date: i.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incidents");
    XLSX.writeFile(workbook, "Incidents_Report.xlsx");
  };

  return (
    <div className="bg-[#f5f8fa] min-h-screen overflow-x-hidden">
      <TopBar onSearch={setSearchQuery} onStationSelect={setSelectedStation} />

      {/* ===== Header Section ===== */}
      <div className="px-4 sm:px-6 md:px-10 py-4 border-b border-gray-200 bg-[#f5f8fa]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-[#0b2c64]">
                All Incidents
              </h1>
              {/* <p className="text-sm text-[#4a5a73] mt-1">
                Showing {incidentCount}{" "}
                {incidentCount === 1 ? "incident" : "incidents"}
              </p> */}
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
                className={`ml-1 transition-transform ${
                  exportOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {exportOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-44 z-20 animate-fadeIn">
                <ul className="text-sm text-gray-700">
                  <li
                    onClick={() => {
                      handleExportPDF();
                      setExportOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-md"
                  >
                    Export as PDF
                  </li>
                  <li
                    onClick={() => {
                      handleExportExcel();
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
              className={`p-3 rounded-xl shadow-md transition ${
                view === "grid"
                  ? "bg-[#0b2c64] text-white hover:bg-[#09305f]"
                  : "bg-white border border-gray-200 text-[#0b2c64] hover:bg-gray-50"
              }`}
            >
              <LayoutGrid size={18} />
            </button>

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
      </div>

      {/* ===== Main Content ===== */}
      <div className="px-4 sm:px-6 md:px-10 py-6 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto">
        <div className="w-full lg:w-72 shrink-0">
          <FilterPanel
            filters={filters}
            onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
          />
        </div>

        <section className="flex-1 ml-2">
          <IncidentList
            view={view}
            onDataLoaded={setIncidentCount}
            incidentsData={filteredIncidents}
          />
        </section>
      </div>
    </div>
  );
}
