// lib/exportIncidents.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Helper: Format ISO date into readable human format
function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export type IncidentForExport = {
  _id?: string;
  id?: string;
  type?: string | null;
  issue_type?: string | null;
  station?: string | null;
  status?: string | null;
  officer?: string | null;
  date?: string | null;
  createdAt?: string | null;
  action_time?: string | null; // legacy
  timetaken?: string | null; // prefer this for "minutes" string
  // staff removed
};

export async function exportIncidentsAsPDF(
  incidents: IncidentForExport[],
  opts?: { filename?: string; title?: string; logoUrl?: string }
) {
  const filename = opts?.filename ?? "Incidents_Report.pdf";
  const title = opts?.title ?? "Incident Report";
  const logoUrl = opts?.logoUrl ?? "/rpf_logo.png"; // path to logo image in /public

  const doc = new jsPDF("p", "pt");

  // Try loading the logo (optional)
  let logoImg: string | null = null;
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    const reader = new FileReader();
    logoImg = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Logo not found or failed to load:", e);
  }

  // --- Group incidents by calendar day (YYYY-MM-DD). Invalid dates go to "Unknown" group.
  const groups: Record<string, IncidentForExport[]> = {};

  incidents.forEach((i) => {
    const dateRaw = i.date ?? i.createdAt ?? "";
    const d = new Date(dateRaw);
    let dayKey: string;
    if (!dateRaw || Number.isNaN(d.getTime())) {
      dayKey = "unknown";
    } else {
      // use local date portion in YYYY-MM-DD to group by day
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      dayKey = `${year}-${month}-${day}`;
    }
    if (!groups[dayKey]) groups[dayKey] = [];
    groups[dayKey].push(i);
  });

  // Sort day keys: newest date first, unknown last
  const sortedDayKeys = Object.keys(groups).sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  let isFirstPage = true;

  for (const dayKey of sortedDayKeys) {
    const dayIncidents = groups[dayKey];

    // Sort incidents within the day newest-first (by full timestamp)
    const sortedDayIncidents = [...dayIncidents].sort((a, b) => {
      const da = new Date(a.date ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.date ?? b.createdAt ?? 0).getTime();
      return db - da;
    });

    if (!isFirstPage) doc.addPage();
    isFirstPage = false;

    // === Header (per-page) ===
    if (logoImg) {
      try {
        doc.addImage(logoImg, "PNG", 40, 30, 60, 60); // x, y, width, height
      } catch (e) {
        // ignore image errors
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#0b2c64");
    doc.text("RPF Assistance Management System", 120, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor("#333333");

    // Title for the day: if unknown, show "Unknown Date"
    const formattedDayTitle =
      dayKey === "unknown"
        ? "Unknown Date"
        : new Date(dayKey + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

    // Place the day title on the right side of header
    doc.setFontSize(14);
    doc.text(title, 120, 75);

    // Draw a date "tile" on the right side
    const tileText = formattedDayTitle;
    const tileWidth = doc.getTextWidth(tileText) + 18; // padding
    const pageWidth = doc.internal.pageSize.getWidth();
    const tileX = pageWidth - tileWidth - 40; // 40pt right margin
    const tileY = 40;
    const tileHeight = 28;

    doc.setDrawColor(11, 44, 100);
    doc.setFillColor(240, 245, 255);
    doc.rect(tileX, tileY, tileWidth, tileHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#0b2c64");
    doc.text(tileText, tileX + 9, tileY + 18);

    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 120, 92);

    // Divider
    doc.setDrawColor(11, 44, 100);
    doc.setLineWidth(0.8);
    doc.line(40, 105, pageWidth - 40, 105);

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#0b2c64");
    doc.setFontSize(12);
    doc.text(`Incidents: ${sortedDayIncidents.length}`, 40, 125);

    // Table columns: removed Staff column to save space
    const tableColumn = [
      "ID",
      "Type",
      "Station",
      "Status",
      "Officer",
      "Time",
      "Action Time",
    ];

    // Build rows: truncate ID for better PDF layout and format action_time/timetaken
    const tableRows = sortedDayIncidents.map((i) => {
      // Truncate long IDs for better PDF layout (keep full ID in Excel)
      const rawId = String(i.id ?? i._id ?? "-");
      const shortId =
        rawId === "-" || rawId.length <= 18
          ? rawId
          : `${rawId.slice(0, 8)}...${rawId.slice(-4)}`;

      const d = new Date(i.date ?? i.createdAt ?? "");
      const timeStr =
        !i.date && !i.createdAt
          ? "-"
          : Number.isNaN(d.getTime())
          ? "-"
          : d.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });

      // --- Prefer timetaken (minutes string) and fall back to action_time (legacy) ---
      const actionTimeRaw = (i as any).timetaken ?? i.action_time ?? "";
      let actionTimeStr = "-";

      if (actionTimeRaw === null || actionTimeRaw === undefined || actionTimeRaw === "") {
        actionTimeStr = "-";
      } else if (/^\s*\d+\s*$/.test(String(actionTimeRaw))) {
        // numeric minutes like "6"
        const mins = parseInt(String(actionTimeRaw).trim(), 10);
        actionTimeStr = `${mins} min`;
      } else {
        // try parse as date/time (in case legacy values are timestamps)
        const ad = new Date(String(actionTimeRaw));
        if (!Number.isNaN(ad.getTime())) {
          actionTimeStr = ad.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
        } else {
          // fallback to raw string
          actionTimeStr = String(actionTimeRaw);
        }
      }

      return [
        shortId,
        i.type ?? i.issue_type ?? "-",
        i.station ?? "-",
        i.status ?? "-",
        i.officer ?? "-",
        timeStr,
        actionTimeStr,
      ];
    });

    // Tighter, centered table styling (no Staff column)
    autoTable(doc, {
      startY: 140,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [11, 44, 100],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        fontSize: 10,
      },
      styles: {
        fontSize: 9, // slightly larger than before for readability
        cellPadding: 5, // balanced padding
        lineColor: [200, 200, 200],
        lineWidth: 0.08,
        overflow: "linebreak", // allow wrapping where needed
        halign: "center",
        valign: "middle",
      },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      columnStyles: {
        0: { cellWidth: 72, halign: "left" },  // ID (left-align short id)
        1: { cellWidth: 80, halign: "center" }, // Type
        2: { cellWidth: 90, halign: "center" }, // Station
        3: { cellWidth: 60, halign: "center" }, // Status
        4: { cellWidth: 80, halign: "center" }, // Officer
        5: { cellWidth: 70, halign: "center" }, // Time
        6: { cellWidth: 70, halign: "center" }, // Action Time
      },
      // Increase left/right margins to visually center the table
      margin: { left: 55, right: 55 },
      tableLineWidth: 0,
    });
  }

  // === Footer for all pages ===
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(9);
    doc.setTextColor("#888");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(
      `© ${new Date().getFullYear()} RPF Assistance Management System — Confidential`,
      40,
      doc.internal.pageSize.height - 30
    );
    doc.text(
      `Page ${p} of ${pageCount}`,
      pageWidth - 80,
      doc.internal.pageSize.height - 30
    );
  }

  // === Save PDF ===
  doc.save(filename);
}

export function exportIncidentsAsExcel(
  incidents: IncidentForExport[],
  opts?: { filename?: string }
) {
  const filename = opts?.filename ?? "Incidents_Report.xlsx";

  // Sort newest-first
  const sortedIncidents = [...incidents].sort((a, b) => {
    const da = new Date(a.date ?? a.createdAt ?? 0).getTime();
    const db = new Date(b.date ?? b.createdAt ?? 0).getTime();
    return db - da; // newest first
  });

  const worksheetData = sortedIncidents.map((i) => ({
    ID: i.id ?? i._id ?? "-",
    Type: i.type ?? i.issue_type ?? "-",
    Station: i.station ?? "-",
    Status: i.status ?? "-",
    Officer: i.officer ?? "-",
    Date: formatDate(i.date ?? i.createdAt), // <-- formatted date
    // Prefer timetaken (minutes) and show "X min", otherwise format as date or show raw fallback
    "Action Time": (() => {
      const v = (i as any).timetaken ?? i.action_time ?? "";
      if (v === null || v === undefined || v === "") return "-";
      if (/^\s*\d+\s*$/.test(String(v))) return `${parseInt(String(v).trim(), 10)} min`;
      // try format as date
      const parsed = new Date(String(v));
      if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      return String(v);
    })(),
    // Staff removed from Excel output
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Add a custom title row
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["RPF Assistance Management System - Incident Report"]],
    { origin: "A1" }
  );

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Generated:", new Date().toLocaleString()]],
    { origin: "A2" }
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, "Incidents");
  XLSX.writeFile(workbook, filename);
}
