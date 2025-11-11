// components/dashboard-componets/FilterPanel.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

// Define props type
export interface Filters {
  station: string;
  priority: string;
  status: string;
  time: string;
  type: string;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (updated: Partial<Filters>) => void;
  // optionally supply stations list (from dashboard fetch)
  stations?: string[];
}

export default function FilterPanel({ filters, onChange, stations = [] }: FilterPanelProps) {
  const [openDropdown, setOpenDropdown] = useState<keyof Filters | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Reusable dropdown component
  const Dropdown = ({
    label,
    options,
    selected,
    id,
  }: {
    label: string;
    options: string[];
    selected: string;
    id: keyof Filters;
  }) => {
    return (
      <div className="relative w-full" aria-haspopup="listbox" aria-expanded={openDropdown === id}>
        <label className="block text-sm font-semibold mb-2 text-[#0b2c64]">{label}</label>

        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
          aria-controls={`${id}-listbox`}
          className="w-full flex items-center justify-between border border-gray-300 bg-[#f9fbfd]
                   rounded-lg px-3 py-2.5 text-sm text-[#0b2c64] shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#0b2c64] transition"
        >
          <span className="truncate">{selected}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${openDropdown === id ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>

        {openDropdown === id && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto text-sm py-1"
          >
            {options.map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={selected === opt}
                onClick={() => {
                  onChange({ [id]: opt } as Partial<Filters>);
                  setOpenDropdown(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md select-none ${selected === opt ? "bg-[#e6efff] text-[#0b2c64] font-medium" : "text-[#0b2c64] hover:bg-[#e6efff]"
                  }`}
              >
                {selected === opt && <Check className="h-4 w-4 text-[#0b2c64]" />}
                <span className="truncate">{opt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <aside ref={containerRef} className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-[#0b2c64]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-[#0b2c64]" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      {/* Station Dropdown (use provided stations list or defaults) */}
      <div>
        <Dropdown
          id="station"
          label="Station"
          selected={filters.station}
          options={[...Array.from(new Set(stations.length ? stations : [

          ]))]}
        />
      </div>

      {/* Type Radio Buttons */}
      <div className="mt-5">
        <label className="block text-sm font-semibold mb-2 text-[#0b2c64]">Type</label>
        <div className="space-y-2">
          {["", "Panic", "Theft", "Harassment", "Suspicious", "Lost", "Security"].map((opt) => (
            <label key={opt || "any"} className="flex items-center text-sm text-[#0b2c64] cursor-pointer">
              <input
                type="radio"
                name="type"
                value={opt}
                checked={filters.type === opt}
                onChange={() => onChange({ type: opt })}
                className="mr-2 text-[#0b2c64] focus:ring-[#0b2c64]"
              />
              {opt === "" ? "Any" : opt}
            </label>
          ))}
        </div>
      </div>

      {/* Priority Dropdown */}
      {/* <div className="mt-5">
        <Dropdown id="priority" label="Priority" selected={filters.priority} options={["All Priorities", "High", "Medium", "Low"]} />
      </div> */}

      {/* Status Dropdown (keep casing consistent with your backend if needed) */}
      <div className="mt-5">
        <Dropdown
          id="status"
          label="Status"
          selected={filters.status}
          options={["All Statuses", "OPEN", "IN-PROGRESS", "RESOLVED", "CLOSED"]}
        />
      </div>

      {/* Time Range Dropdown */}
      <div className="mt-5">
        <Dropdown id="time" label="Time Range" selected={filters.time} options={["Last 24 hours", "Last 7 days", "Last 30 days"]} />
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onChange({
            station: "All Stations",
            priority: "All Priorities",
            status: "All Statuses",
            type: "",
            time: "Last 24 hours",
          })
        }
        className="w-full mt-6 text-sm font-semibold text-[#0b2c64] border border-gray-300 rounded-lg py-2.5 hover:bg-[#f2f6ff] transition flex items-center justify-center gap-2"
      >
        ✕ Reset Filters
      </button>
    </aside>
  );
}
