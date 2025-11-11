"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const STATUSES = ["OPEN", "IN-PROGRESS", "RESOLVED", "CLOSED"] as const;
type Status = typeof STATUSES[number];

const statusColors: Record<Status, string> = {
  OPEN: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
  "IN-PROGRESS": "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
  CLOSED: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
};

export default function ActionsPanel({ incident }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : "";

  const currentFromIncident = (incident?.status ?? "OPEN").toString().toUpperCase() as Status;
  const initialStatus: Status = STATUSES.includes(currentFromIncident as Status)
    ? currentFromIncident
    : "OPEN";

  const [selected, setSelected] = useState<Status>(initialStatus);
  const [saved, setSaved] = useState<Status>(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = (incident?.status ?? "OPEN").toString().toUpperCase() as Status;
    const normalized = STATUSES.includes(s as Status) ? s : "OPEN";
    setSelected(normalized);
    setSaved(normalized);
  }, [incident?.status]);

  const handleSelect = (status: Status) => {
    setSelected(status);
    setError(null);
  };

  const handleUpdate = async () => {
    if (selected === saved) return;
    setError(null);
    setUpdating(true);

    try {
      const targetId = incident?._id ?? incident?.id ?? incident?.incidentId;
      if (!targetId) throw new Error("Missing incident ID");

      const res = await fetch(`/api/incident/${targetId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selected, id: targetId }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText || "Failed");
        throw new Error(txt || "Update failed");
      }

      const json = await res.json().catch(() => ({}));
      const serverStatus = (json?.incident?.status ?? selected).toString().toUpperCase() as Status;
      const finalStatus = STATUSES.includes(serverStatus) ? serverStatus : selected;

      setSaved(finalStatus);
      setSelected(finalStatus);

      // Emit update event for other components
      try {
        window?.dispatchEvent(new CustomEvent("incident:updated", { detail: { id: targetId, status: finalStatus } }));
      } catch { }

      // Refresh current route (forces refetch in page)
      await router.replace(pathname + (search || ""));

      console.log("Incident updated and route replaced:", { targetId, finalStatus });
    } catch (err: any) {
      setError(err?.message ?? "Network error");
      console.error("Status update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  const isChanged = selected !== saved;

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
      <h3 className="text-lg font-semibold text-[#0b2c64] mb-3">Status</h3>

      {/* Status Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            disabled={updating}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${selected === s
                ? "bg-[#0b2c64] text-white border-[#0b2c64]"
                : statusColors[s]
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpdate}
        disabled={!isChanged || updating}
        className={`w-full py-2.5 rounded-lg font-medium transition ${!isChanged
            ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
            : "bg-green-600 text-white hover:bg-green-700"
          }`}
      >
        {updating ? "Updating…" : "Update Status"}
      </button>

      {/* Error + Info */}
      {error && <div className="text-xs text-red-600 mt-3">{error}</div>}
      <div className="text-xs text-gray-400 mt-3">Last saved: {saved}</div>
    </div>
  );
}
