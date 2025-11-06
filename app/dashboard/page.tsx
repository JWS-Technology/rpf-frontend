"use client";

import { useState, useMemo } from "react";
import TopBar from "../components/TopBar";
import FilterPanel from "../components/FilterPanel";
import IncidentList, { incidents } from "../components/IncidentList";
import { LayoutGrid, List, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DashboardPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [incidentCount, setIncidentCount] = useState<number>(0);

  // ✅ Compute dynamic status summary
  const statusSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    incidents.forEach((incident) => {
      const status = incident.status.toUpperCase();
      summary[status] = (summary[status] || 0) + 1;
    });
    return summary;
  }, []);

  // ✅ Export to PDF Function
  const handleExportPDF = () => {
    const doc = new jsPDF("p", "pt");

    // ===== Title =====
    doc.setFontSize(18);
    doc.setTextColor("#0b2c64");
    doc.text("Incident Report", 40, 40);

    // ===== Subtitle =====
    doc.setFontSize(11);
    doc.setTextColor("#4a5a73");
    doc.text(`Total Incidents: ${incidents.length}`, 40, 60);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 80);

    // ===== Table Data =====
    const tableColumn = ["ID", "Type", "Station", "Status", "Officer", "Date"];
    const tableRows = incidents.map((i) => [
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
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [11, 44, 100], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 248, 250] },
    });

    // ===== Footer =====
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 70,
        doc.internal.pageSize.getHeight() - 20
      );
    }

    // ===== Download File =====
    doc.save("Incidents_Report.pdf");
  };

  return (
    <div className="bg-[#f5f8fa] min-h-screen overflow-x-hidden">
      <TopBar />

{/* ===== Header Section ===== */}
<div className="px-4 sm:px-6 md:px-10 py-4 border-b border-gray-200 bg-[#f5f8fa]">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    
    {/* ===== Left: Title + Status Summary (inline) ===== */}
    <div className="flex flex-col lg:flex-row lg:items-center gap-5 flex-wrap">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#0b2c64]">All Incidents</h1>
        <p className="text-sm text-[#4a5a73] mt-1">
          Showing {incidentCount} {incidentCount === 1 ? "incident" : "incidents"}
        </p>
      </div>

      {/* ===== Inline Status Summary ===== */}
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

    {/* ===== Right Section — Actions ===== */}
    <div className="flex items-center gap-3">
      {/* ✅ Export PDF Button */}
      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 bg-white border border-gray-200 text-[#0b2c64] font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition"
      >
        <Download size={18} />
        Export PDF
      </button>

      {/* Grid/List Buttons */}
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
        <div className="w-full md:w-[65%] lg:w-88 shrink-0 transition-all duration-300">
          <FilterPanel />
        </div>

        <div className="flex-1">
          <IncidentList
            view={view}
            onDataLoaded={(count) => setIncidentCount(count)}
          />
        </div>
      </div>
    </div>
  );
}
