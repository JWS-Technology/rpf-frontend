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

export default function TopBar() {
  const [station, setStation] = useState("All Stations");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stations = [
    "All Stations",
    "Coimbatore Junction",
    "Chennai Central",
    "New Delhi",
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

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        {/* LEFT — Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#0b2c64] text-white font-bold text-lg px-3 py-1 rounded-md">
            RPF
          </div>
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
                className={`ml-2 text-[#0b2c64] transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-56">
                <ul className="py-1 text-sm text-[#0b2c64]">
                  {stations.map((s) => (
                    <li
                      key={s}
                      onClick={() => {
                        setStation(s);
                        setMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-md mx-1 transition ${
                        station === s
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

        {/* RIGHT — Icons + Burger */}
        <div className="flex items-center gap-3 flex-shrink-0">
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

          <div className="flex items-center gap-2">
            <User className="text-gray-700 w-5 h-5 cursor-pointer" />
            <LogOut className="text-gray-700 w-5 h-5 cursor-pointer" />
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden flex items-center justify-center p-2 rounded-md border border-gray-200 hover:bg-gray-100"
          >
            {mobileMenu ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <User className="text-[#0b2c64] w-6 h-6" />
              <div>
                <p className="text-sm font-semibold text-[#0b2c64]">
                  Officer Kumar
                </p>
                <p className="text-xs text-gray-500">
                  Control Room Operator
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="bg-transparent outline-none text-gray-700 text-sm flex-1"
            />
          </div>

          {/* Custom Dropdown (Mobile same as Desktop) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMobileDropdown(!mobileDropdown)}
              className="flex items-center justify-between bg-[#f9fafb] text-[#0b2c64] border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0b2c64] transition w-full"
            >
              <span className="truncate">{station}</span>
              <ChevronDown
                size={16}
                className={`ml-2 text-[#0b2c64] transition-transform duration-200 ${
                  mobileDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileDropdown && (
              <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-full">
                <ul className="py-1 text-sm text-[#0b2c64]">
                  {stations.map((s) => (
                    <li
                      key={s}
                      onClick={() => {
                        setStation(s);
                        setMobileDropdown(false);
                      }}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-md mx-1 transition ${
                        station === s
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
      )}
    </header>
  );
}
