"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Check,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

interface TopBarProps {
  onSearch: (query: string) => void;
  onStationSelect: (station: string) => void;
}

export default function TopBar({ onSearch, onStationSelect }: TopBarProps) {
  const [station, setStation] = useState("All Stations");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stations = [
    "All Stations",
    "Srirangam",
    "Trichy Centeral Junction"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setMobileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle station selection
  const handleStationChange = (selectedStation: string) => {
    setStation(selectedStation);
    setMenuOpen(false);
    setMobileDropdown(false);
    onStationSelect(selectedStation);
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        {/* LEFT — Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Image
            src="/rpf_logo.png"
            alt="RPF Logo"
            width={52}
            height={52}
            className="object-contain rounded-md"
            priority
          />
          <div className="hidden sm:block">
            <h1 className="font-semibold text-[#0b2c64] text-base sm:text-lg">
              RPF Operations Portal
            </h1>
            <p className="text-xs text-gray-500 -mt-1">
              Railway Protection Force
            </p>
          </div>
        </div>

        {/* CENTER — Search + Dropdown (Desktop only) */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-3">
          <div className="flex items-center bg-[#f2f5f8] rounded-lg px-3 py-2 w-full max-w-md border border-gray-200">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search incidents by ID, station, or type..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-transparent outline-none text-gray-700 text-sm flex-1"
            />
          </div>

          {/* Dropdown (Desktop) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-between bg-[#f9fafb] text-[#0b2c64] border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0b2c64] transition w-48"
            >
              <span className="truncate">{station}</span>
              <ChevronDown
                size={16}
                className={`ml-2 text-[#0b2c64] transition-transform duration-200 ${menuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-56">
                <ul className="py-1 text-sm text-[#0b2c64]">
                  {stations.map((s) => (
                    <li
                      key={s}
                      onClick={() => handleStationChange(s)}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-md mx-1 transition ${station === s
                        ? "bg-blue-100 text-[#0b2c64] font-medium"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <span>{s}</span>
                      {station === s && (
                        <Check className="w-4 h-4 text-[#0b2c64]" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Icons */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Bell className="text-gray-600 w-5 h-5 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-[#0b2c64]">
              Officer Kumar
            </span>
            <span className="text-xs text-gray-500">Control Room Operator</span>
          </div>

          <User className="text-gray-700 w-5 h-5 cursor-pointer" />
          <LogOut className="text-gray-700 w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
