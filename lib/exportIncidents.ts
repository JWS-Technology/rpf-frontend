// lib/exportIncidents.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// You can place your logo in public folder: /public/rpf_logo.png
// and use '/rpf_logo.png' as the path.

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

  // === Header ===
  if (logoImg) {
    doc.addImage(logoImg, "PNG", 40, 30, 60, 60); // x, y, width, height
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor("#0b2c64");
  doc.text("RPF Assistance Management System", 120, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#333333");
  doc.text(title, 120, 75);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 120, 92);

  // === Divider line ===
  doc.setDrawColor(11, 44, 100);
  doc.setLineWidth(0.8);
  doc.line(40, 105, 550, 105);

  // === Incident Summary ===
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#0b2c64");
  doc.setFontSize(12);
  doc.text(`Total Incidents: ${incidents.length}`, 40, 125);

  // === Table ===
  const tableColumn = ["ID", "Type", "Station", "Status", "Officer", "Date"];
  const tableRows = incidents.map((i) => [
    i.id ?? i._id ?? "-",
    i.type ?? i.issue_type ?? "-",
    i.station ?? "-",
    i.status ?? "-",
    i.officer ?? "-",
    i.date ?? i.createdAt ?? "-",
  ]);

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
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    alternateRowStyles: { fillColor: [240, 245, 255] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 100 },
      2: { cellWidth: 90 },
      3: { cellWidth: 70 },
      4: { cellWidth: 90 },
      5: { cellWidth: 100 },
    },
  });

  // === Footer ===
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor("#888");
    doc.text(
      `© ${new Date().getFullYear()} RPF Assistance Management System — Confidential`,
      40,
      doc.internal.pageSize.height - 30
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      500,
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

  const worksheetData = incidents.map((i) => ({
    ID: i.id ?? i._id ?? "-",
    Type: i.type ?? i.issue_type ?? "-",
    Station: i.station ?? "-",
    Status: i.status ?? "-",
    Officer: i.officer ?? "-",
    Date: i.date ?? i.createdAt ?? "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Add a custom title row
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["RPF Assistance Management System - Incident Report"]],
    {
      origin: "A1",
    }
  );
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Generated:", new Date().toLocaleString()]],
    {
      origin: "A2",
    }
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, "Incidents");
  XLSX.writeFile(workbook, filename);
}
