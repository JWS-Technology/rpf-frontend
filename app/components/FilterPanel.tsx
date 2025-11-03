"use client";

import { useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

export default function FilterPanel() {
  const [station, setStation] = useState("All Stations");
  const [priority, setPriority] = useState("All Priorities");
  const [status, setStatus] = useState("All Statuses");
  const [time, setTime] = useState("Last 24 hours");
  const [type, setType] = useState("");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Reusable dropdown component
  const Dropdown = ({ label, options, selected, onChange, id }: any) => (
    <div className="relative w-full">
      <label className="block text-sm font-semibold mb-2 text-[#0b2c64]">
        {label}
      </label>

      {/* Main button */}
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

      {/* Dropdown list */}
      {openDropdown === id && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg 
                     shadow-lg max-h-60 overflow-auto text-sm py-1"
        >
          {options.map((opt: string) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md 
                ${
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
    <aside className="w-full lg:w-72 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-[#0b2c64]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-[#0b2c64]" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      {/* Station Dropdown */}
      <Dropdown
        id="station"
        label="Station"
        selected={station}
        onChange={setStation}
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
                  checked={type === opt}
                  onChange={() => setType(opt)}
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
          selected={priority}
          onChange={setPriority}
          options={["All Priorities", "High", "Medium", "Low"]}
        />
      </div>

      {/* Status Dropdown */}
      <div className="mt-5">
        <Dropdown
          id="status"
          label="Status"
          selected={status}
          onChange={setStatus}
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
          selected={time}
          onChange={setTime}
          options={["Last 24 hours", "Last 7 days", "Last 30 days"]}
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setStation("All Stations");
          setPriority("All Priorities");
          setStatus("All Statuses");
          setTime("Last 24 hours");
          setType("");
        }}
        className="w-full mt-6 text-sm font-semibold text-[#0b2c64] border border-gray-300 rounded-lg py-2.5 hover:bg-[#f2f6ff] transition flex items-center justify-center gap-2"
      >
        ✕ Reset Filters
      </button>
    </aside>
  );
}
