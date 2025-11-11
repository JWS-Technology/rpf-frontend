"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import IncidentHeader from "../../components/incidents/IncidentHeader";
import IncidentDetails from "../../components/incidents/IncidentDetails";
import EvidenceSection from "../../components/incidents/EvidenceSection";
import IncidentTimeline from "../../components/incidents/IncidentTimeline";
import AddNote from "../../components/incidents/AddNote";
import ActionsPanel from "../../components/incidents/ActionsPanel";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type RawIncident = {
  _id?: string;
  id?: string;
  incidentId?: string;
  issue_type?: string | null;
  type?: string | null;
  station?: string | null;
  status?: string | null;
  officer?: string | null;
  date?: string | null;
  createdAt?: string | null;
  phone_number?: string | null;
  phone?: string | null;
  audio_url?: string | null;
  [k: string]: any;
};

export default function IncidentPage() {

  const router = useRouter();
  const { id: rawId } = useParams();

  // Make sure id is a single string
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "";


  const [incident, setIncident] = useState<RawIncident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // timer ref to delay showing "not found"
  const notFoundTimeoutRef = useRef<number | null>(null);
  const NOT_FOUND_DELAY_MS = 500; // adjust if you want shorter/longer

  // abort controller ref to cancel inflight fetches
  const controllerRef = useRef<AbortController | null>(null);

  // track whether we've already performed a router.replace to canonical id (avoid loops)
  const replacedOnceRef = useRef(false);

  const cleanPhone = (p?: string | null) => {
    const phone = (p ?? "").toString().trim();
    if (!phone) return null;
    if (phone.toLowerCase() === "nill" || phone.toLowerCase() === "nil") return null;
    return phone;
  };
  const formatIndian = (s?: string | null) => {
    if (!s) return "—";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  const clearNotFoundTimer = () => {
    if (notFoundTimeoutRef.current) {
      window.clearTimeout(notFoundTimeoutRef.current);
      notFoundTimeoutRef.current = null;
    }
  };

  const fetchIncident = useCallback(
    async (opts?: { signal?: AbortSignal }) => {
      if (!id) {
        setError("No incident id provided");
        setLoading(false);
        return;
      }

      // abort previous inflight request
      try { controllerRef.current?.abort(); } catch { }
      const controller = new AbortController();
      controllerRef.current = controller;

      // ensure no stale timers / errors
      clearNotFoundTimer();
      setError(null);
      setLoading(true);

      const signal = opts?.signal ?? controller.signal;

      const trySingle = async () => {
        try {
          const url = `/api/incident/${encodeURIComponent(id)}`;
          const res = await fetch(url, { signal });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            return json?.incident ?? json ?? null;
          } else {
            const txt = await res.text().catch(() => "");
            console.warn(`trySingle: /api/incident/${id} returned ${res.status}`, txt);
            return null;
          }
        } catch (err: any) {
          if (err?.name === "AbortError") return null;
          console.warn("trySingle failed:", err);
          return null;
        }
      };

      const tryListFind = async () => {
        try {
          const res = await fetch("/api/incident-list", { signal });
          if (!res.ok) {
            const res2 = await fetch("/api/incidents", { signal });
            if (!res2.ok) {
              console.warn("Both /api/incident-list and /api/incidents failed");
              return null;
            }
            const j2 = await res2.json();
            const list2 = Array.isArray(j2) ? j2 : Array.isArray(j2.incidents) ? j2.incidents : [];
            return list2.find((doc: any) => doc._id === id || doc.id === id || doc.incidentId === id) ?? null;
          }
          const json = await res.json();
          const list = Array.isArray(json) ? json : Array.isArray(json.incidents) ? json.incidents : [];
          const found = list.find((doc: any) => doc._id === id || doc.id === id || doc.incidentId === id) ?? null;
          return found;
        } catch (err: any) {
          if (err?.name === "AbortError") return null;
          console.warn("tryListFind failed:", err);
          return null;
        }
      };

      try {
        // PERFORM fetch attempts first (no early "not found" state)
        let doc = await trySingle();
        if (!doc) doc = await tryListFind();

        // If found, clear any pending not-found timer and update state
        clearNotFoundTimer();
        if (doc) {
          const normalized: RawIncident = {
            ...doc,
            id: doc.id ?? doc.incidentId ?? doc._id ?? doc.id,
            type: doc.type ?? doc.issue_type ?? "",
            station: doc.station ?? "",
            status: (doc.status ?? "").toString(),
            officer: doc.officer ?? "",
            date: doc.date ?? doc.createdAt ?? "",
            createdAt: doc.createdAt ?? doc.createdAt,
            phone_number: cleanPhone(doc.phone_number ?? doc.phone ?? doc.phoneNumber ?? null),
            audio_url: doc.audio_url ?? doc.audioUrl ?? "",
          };

          setIncident(normalized);
          setLoading(false);

          // If route id is not the canonical _id, replace URL to canonical id once
          const canonical = (normalized._id ?? normalized.id ?? "").toString();
          const routeIdStr = (id ?? "").toString();
          if (canonical && canonical !== routeIdStr && !replacedOnceRef.current) {
            replacedOnceRef.current = true;
            // abort inflight and clear timers before navigation
            try { controllerRef.current?.abort(); } catch { }
            clearNotFoundTimer();
            try {
              // await so we don't continue updating state on the old instance
              await router.replace(`/incidents/${encodeURIComponent(canonical)}`);
              return; // done; new route will remount
            } catch (e) {
              console.warn("router.replace failed:", e);
              // fall through and keep showing the normalized data
            }
          }

          return;
        }

        // If no doc found: keep showing loading for a short delay then show "not found".
        // This prevents flicker (so users see Loading... before error).
        clearNotFoundTimer();
        notFoundTimeoutRef.current = window.setTimeout(() => {
          // only update UI if request still not aborted
          if (!controller.signal.aborted) {
            setError("Incident not found");
            setIncident(null);
            setLoading(false);
          }
          notFoundTimeoutRef.current = null;
        }, NOT_FOUND_DELAY_MS);

      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Error loading incident:", err);
        clearNotFoundTimer();
        setError(err?.message ?? "Unknown error");
        setLoading(false);
      }
    },
    [id, router]
  );


  // initial load + cleanup
  useEffect(() => {
    fetchIncident();

    return () => {
      try {
        controllerRef.current?.abort();
      } catch { }
      controllerRef.current = null;
      clearNotFoundTimer();
    };
  }, [fetchIncident]);

  // listen for incident updates and refresh when id matches (or no id in event)
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        // if we are in the middle of replacing to canonical id, ignore incoming events
        if (replacedOnceRef.current) return;

        const detail = (e as CustomEvent)?.detail;
        if (detail && detail.id && detail.id !== id) return;

        // abort any inflight request and re-fetch safely
        try { controllerRef.current?.abort(); } catch { }
        fetchIncident();
      } catch (err) {
        try { router.replace(window.location.pathname + window.location.search); } catch { }
      }
    };


    window.addEventListener("incident:updated", handler as EventListener);
    return () => window.removeEventListener("incident:updated", handler as EventListener);
  }, [fetchIncident, id, router]);

  const phoneDisplay = (inc: RawIncident | null) => {
    const p = cleanPhone(inc?.phone_number);
    if (!p) return <p className="text-sm text-gray-500 mt-1 leading-snug">No phone number</p>;
    return (
      <a className="text-sm text-[#4a5a73] mt-1 leading-snug line-clamp-2" href={`tel:+91${p}`}>
        +91 {p}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f6f9] text-[#0b2c64]">
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#0b2c64] font-medium bg-transparent hover:bg-[#dbeafe] transition-colors duration-200 mt-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <section className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-5 mt-6">
          {loading ? (
            <div className="py-8 text-center text-gray-600">Loading incident…</div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="text-red-600 font-semibold mb-2">{error}</div>
              <div className="text-sm text-gray-600">Try refreshing or go back to the dashboard.</div>
              <div className="mt-4 flex justify-center gap-3">
                <button onClick={() => fetchIncident()} className="px-4 py-2 bg-[#0b2c64] text-white rounded-md">
                  Retry
                </button>
                <Link href="/dashboard" className="px-4 py-2 border rounded-md text-[#0b2c64]">
                  Dashboard
                </Link>
              </div>
            </div>
          ) : incident ? (
            <IncidentHeader
              incident={{
                id: incident.id,
                title: incident.id ?? incident.type,
                status: incident.status,
                severity: incident.status === "OPEN" ? "HIGH" : "MEDIUM",
                slaBreach: false,
                location: incident.station ?? "",
                timestamp: formatIndian(incident.date ?? incident.createdAt),
                type: incident.type,
                phone: incident.phone_number ?? undefined,
                kiosk: incident.kiosk ?? "",
                platform: incident.platform ?? "",
                assignedTo: incident.officer ?? "",
                role: incident.role ?? "",
                ...incident,
              }}
            />
          ) : (
            <div className="py-8 text-center text-gray-600">No incident data available.</div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-6">
              {loading ? (
                <div className="py-6 text-center text-gray-600">Loading details…</div>
              ) : incident ? (
                <IncidentDetails
                  incident={{
                    ...incident,
                    phone_display: incident.phone_number ?? null,
                    formattedDate: formatIndian(incident.date ?? incident.createdAt),
                  }}
                />
              ) : (
                <div className="py-6 text-center text-gray-600">No details available.</div>
              )}
            </div>

            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-6">
              <EvidenceSection audioUrl={incident?.audio_url} recordedAt={incident?.kiosk ?? "kiosk"} />

            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-5 sticky top-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#0b2c64] mb-4">Actions</h3>
                {loading ? (
                  <div className="text-sm text-gray-500">Loading…</div>
                ) : incident ? (
                  <ActionsPanel incident={incident} />
                ) : (
                  <div className="text-sm text-gray-500">No actions available.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* helpers */
function formatIndian(s?: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}
