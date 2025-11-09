"use client";

import { useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

// Define props type
interface Filters {
  station: string;
  priority: string;
  status: string;
  time: string;
  type: string;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (updated: Partial<Filters>) => void;
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
  }) => (
    <div className="relative w-full">
      <label className="block text-sm font-semibold mb-2 text-[#0b2c64]">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className="w-full flex items-center justify-between border border-gray-300 bg-[#f9fbfd]
                   rounded-lg px-3 py-2.5 text-sm text-[#0b2c64] shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#0b2c64] transition"
      >
        {selected}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            openDropdown === id ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {openDropdown === id && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto text-sm py-1">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange({ [id]: opt });
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md ${
                selected === opt
                  ? "bg-[#e6efff] text-[#0b2c64] font-medium"
                  : "text-[#0b2c64] hover:bg-[#e6efff]"
              }`}
            >
              {selected === opt && <Check className="h-4 w-4 text-[#0b2c64]" />}
              <span>{opt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <aside className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-[#0b2c64]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-[#0b2c64]" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      {/* Station Dropdown */}
      <Dropdown
        id="station"
        label="Station"
        selected={filters.station}
        options={[
          "All Stations",
          "Coimbatore Junction",
          "Chennai Central",
          "New Delhi",
          "Howrah Junction",
          "Mumbai Central",
        ]}
      />

      {/* Type Radio Buttons */}
      <div className="mt-5">
        <label className="block text-sm font-semibold mb-2 text-[#0b2c64]">
          Type
        </label>
        <div className="space-y-2">
          {["Panic", "Theft", "Harassment", "Suspicious", "Lost", "Security"].map(
            (opt) => (
              <label
                key={opt}
                className="flex items-center text-sm text-[#0b2c64] cursor-pointer"
              >
                <input
                  type="radio"
                  name="type"
                  value={opt}
                  checked={filters.type === opt}
                  onChange={() => onChange({ type: opt })}
                  className="mr-2 text-[#0b2c64] focus:ring-[#0b2c64]"
                />
                {opt}
              </label>
            )
          )}
        </div>
      </div>

      {/* Priority Dropdown */}
      <div className="mt-5">
        <Dropdown
          id="priority"
          label="Priority"
          selected={filters.priority}
          options={["All Priorities", "High", "Medium", "Low"]}
        />
      </div>

      {/* Status Dropdown */}
      <div className="mt-5">
        <Dropdown
          id="status"
          label="Status"
          selected={filters.status}
          options={[
            "All Statuses",
            "Open",
            "Assigned",
            "In Progress",
            "Resolved",
            "Escalated",
          ]}
        />
      </div>

      {/* Time Range Dropdown */}
      <div className="mt-5">
        <Dropdown
          id="time"
          label="Time Range"
          selected={filters.time}
          options={["Last 24 hours", "Last 7 days", "Last 30 days"]}
        />
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
