"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function CreateOfficerPage() {
  const [formData, setFormData] = useState({
    officerId: "",
    name: "",
    phone_number: "",
    role: "Officer",
    station: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const roleOptions = [
    { label: "👮 Officer", value: "Officer" },
    { label: "🧑‍💼 Admin", value: "Admin" },
    { label: "🚓 Dispatcher", value: "Dispatcher" },
  ];

  // Generate officerId (Frontend)
  const generateOfficerId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `OFC-${year}-${random}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const officerId = generateOfficerId();
    const payload = { ...formData, officerId };

    try {
      const res = await fetch("/api/officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create officer");

      setMessage(`✅ Officer created successfully! ID: ${data.officer.officerId}`);
      setFormData({
        officerId: "",
        name: "",
        phone_number: "",
        role: "Officer",
        station: "",
      });
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Officer
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Fill in the officer details below
        </p>

        {/* Officer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Officer Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg text-gray-800 outline-none transition-all"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            placeholder="Enter 10-digit number"
            value={formData.phone_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setFormData({ ...formData, phone_number: value });
              }
            }}
            pattern="\d{10}"
            maxLength={10}
            inputMode="numeric"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     p-3 rounded-lg text-gray-800 outline-none transition-all placeholder-gray-400"
            required
          />
          {formData.phone_number.length > 0 &&
            formData.phone_number.length < 10 && (
              <p className="text-xs text-red-500 mt-1">
                Phone number must be exactly 10 digits
              </p>
            )}
        </div>

        {/* Role Dropdown - Google-style */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>

          <button
            type="button"
            onClick={() => setRoleOpen(!roleOpen)}
            className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none hover:border-blue-400 transition-all"
          >
            <span>
              {roleOptions.find((r) => r.value === formData.role)?.label ||
                "Select Role"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                roleOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {roleOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: option.value });
                    setRoleOpen(false);
                  }}
                  className={`flex justify-between items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors ${
                    formData.role === option.value ? "bg-blue-50" : ""
                  }`}
                >
                  <span>{option.label}</span>
                  {formData.role === option.value && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Station */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Station
          </label>
          <input
            type="text"
            name="station"
            placeholder="Station name"
            value={formData.station}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg text-gray-800 outline-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70"
        >
          {loading ? "Creating Officer..." : "Create Officer"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
