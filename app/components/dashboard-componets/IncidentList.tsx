"use client";
import React, { useEffect, useState, useCallback } from "react";
import IncidentCard from "../IncidentCard";

/* ======= types ======= */
type IncidentType = {
  _id?: string;
  id?: string;
  incidentId?: string;
  issue_type?: string | null;
  type?: string | null;
  description?: string | null;
  station?: string | null;
  status?: string | null;
  officer?: string | null;
  date?: string | null; // ISO string or whatever your API provides
  createdAt?: string | null; // ISO string
  phone_number?: string | null;
  audio_url?: string | null;
};

/* ======= props ======= */
interface IncidentListProps {
  view?: "grid" | "list"; // optional now; default grid will be used if not provided
  onDataLoaded?: (count: number) => void;
  incidentsData?: IncidentType[]; // if provided, we use this; otherwise we fetch
  apiEndpoint?: string; // optional override, default "/api/incident-list"
}

/* ======= component ======= */
export default function IncidentList({
  view = "grid", // default to grid if not provided
  onDataLoaded,
  incidentsData,
  apiEndpoint = "/api/incident-list",
}: IncidentListProps) {
  const [fetched, setFetched] = useState<IncidentType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);

  // Use provided incidentsData when present & non-empty, otherwise use fetched data (if any)
  const baseData: IncidentType[] =
    Array.isArray(incidentsData) && incidentsData.length > 0
      ? incidentsData
      : Array.isArray(fetched) && fetched.length > 0
        ? fetched
        : [];

  // Normalize & sort (newest first) before using
  const norm = (v?: string | null) => (v ?? "").toString();

  const toDate = (doc: IncidentType): Date | null => {
    // prefer `date` field, else createdAt, else null
    const s = doc.date ?? doc.createdAt ?? "";
    const d = s ? new Date(s) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  };

  const sortedData = [...baseData].sort((a, b) => {
    const da = toDate(a);
    const db = toDate(b);
    if (da && db) return db.getTime() - da.getTime(); // newest first
    if (da && !db) return -1;
    if (!da && db) return 1;
    // fallback: sort by createdAt string or _id descending if available
    const sa = (a.createdAt ?? a._id ?? "").toString();
    const sb = (b.createdAt ?? b._id ?? "").toString();
    return sb.localeCompare(sa, undefined, { numeric: true, sensitivity: "base" });
  });

  // notify parent about data length
  useEffect(() => {
    onDataLoaded?.(sortedData.length);
  }, [sortedData, onDataLoaded]);

  // priority helpers (keeps your previous colors/logic)
  const getPriority = (type?: string | null) => {
    const t = norm(type).trim();
    if (t === "Panic") return "emergency";
    if (t === "Theft" || t === "Harassment") return "high";
    if (t === "Suspicious") return "medium";
    return "low";
  };

  const priorityColors: Record<string, string> = {
    emergency: "bg-[#dc3545] text-white",
    high: "bg-[#0b2c64] text-white",
    medium: "bg-[#224b9e] text-white",
    low: "bg-[#617fa3] text-white",
  };

  // Fetch function
  const fetchIncidents = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiEndpoint, { signal });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to fetch incidents (status ${res.status}) ${txt}`);
      }
      const json = await res.json();
      // Accept shape: { incidents: [...] } or an array directly
      const list: IncidentType[] = Array.isArray(json)
        ? json
        : Array.isArray(json.incidents)
          ? json.incidents
          : [];

      // Normalize minimal fields to avoid undefineds
      const normalized = list.map((doc) => ({
        ...doc,
        id: doc.id ?? doc.incidentId ?? doc._id ?? doc.id,
        type: doc.type ?? doc.issue_type ?? "",
        description: doc.description ?? "",
        station: doc.station ?? "",
        status: (doc.status ?? "").toString(),
        officer: doc.officer ?? "",
        date: doc.date ?? doc.createdAt ?? "",
        phone_number: doc.phone_number ?? "",
        audio_url: doc.audio_url ?? "",
      }));

      setFetched(normalized);
      setLastFetchedAt(new Date().toISOString());
    } catch (err: any) {
      if (err?.name === "AbortError") {
        // aborted, ignore
      } else {
        console.error("Error fetching incidents:", err);
        setError(err?.message ?? "Unknown error");
        setFetched([]); // keep it safe
      }
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  // fetch on mount only if incidentsData NOT provided
  useEffect(() => {
    if (Array.isArray(incidentsData) && incidentsData.length > 0) {
      // parent provided data — still we set lastFetchedAt for clarity
      setLastFetchedAt(new Date().toISOString());
      return;
    }
    const controller = new AbortController();
    fetchIncidents(controller.signal);
    return () => controller.abort();
  }, [incidentsData, fetchIncidents]);

  // manual refresh helper
  const handleRefresh = async () => {
    const controller = new AbortController();
    await fetchIncidents(controller.signal);
  };

  // format date/time in Indian timezone
  const formatIndian = (s?: string | null) => {
    if (!s) return "—";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s; // if not a valid date, return raw
    return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  // UI: loading / error / empty states
  if (loading && sortedData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">Loading incidents...</div>
    );
  }

  if (error && sortedData.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm text-center">
        <div className="text-red-600 font-semibold mb-2">Error: {error}</div>
        <div className="text-sm text-gray-600 mb-4">Could not load incidents.</div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={handleRefresh} className="px-4 py-2 bg-[#0b2c64] text-white rounded-md">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!sortedData || sortedData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center text-gray-500 font-medium">
        No incidents found.
        <div className="mt-4">
          <button onClick={handleRefresh} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#0b2c64] hover:bg-gray-50">
            Fetch incidents
          </button>
        </div>
      </div>
    );
  }

  // Render same layout as before (table + grid), using `sortedData`
  return (
    <div className="w-full">
      {/* top-right small controls: last refreshed + manual refresh */}
      <div className="flex justify-end mb-4 gap-3 items-center">
        <div className="text-xs text-gray-500">
          {lastFetchedAt ? `Last updated: ${new Date(lastFetchedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}` : ""}
        </div>
        <button onClick={handleRefresh} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-[#0b2c64] hover:bg-gray-50">
          Refresh
        </button>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {sortedData.map((incident) => {
            const unified = {
              id: incident.id ?? incident._id ?? "—",
              type: norm(incident.type || incident.issue_type),
              description: norm(incident.description),
              station: norm(incident.station),
              date: formatIndian(incident.date ?? incident.createdAt),
              status: norm(incident.status),
              officer: norm(incident.officer),
              phone_number: norm(incident.phone_number),
              audio_url: norm(incident.audio_url),
            };
            return <IncidentCard key={unified.id} incident={unified} />;
          })}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#0b2c64]">Incidents Table</h2>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time (IST)</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-[#334155]">
                {sortedData.map((incident) => {
                  const id = incident.id ?? incident._id ?? "—";
                  const type = norm(incident.type || incident.issue_type);
                  const station = norm(incident.station);
                  const priority = getPriority(type);
                  const statusRaw = norm(incident.status);
                  const statusDisplay = statusRaw ? statusRaw.toLowerCase() : "unknown";
                  const officer = norm(incident.officer);
                  const timeStr = formatIndian(incident.date ?? incident.createdAt);

                  return (
                    <tr key={id} className="hover:bg-[#f8fafc] transition">
                      <td className="px-6 py-4 font-semibold text-[#0b2c64]">{id}</td>
                      <td className="px-6 py-4">{type || "-"}</td>
                      <td className="px-6 py-4">{station || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityColors[priority] ?? priorityColors.low}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{statusDisplay}</td>
                      <td className="px-6 py-4">{officer || "-"}</td>
                      <td className="px-6 py-4">{timeStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* helper outside component to avoid hoisting confusion */
function norm(v?: string | null) {
  return (v ?? "").toString();
}
