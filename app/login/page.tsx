"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [officerId, setOfficerId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your actual user validation logic
    if (officerId.trim() === "" || phone.trim() === "") {
      setError("Please enter Officer ID and Phone Number");
      return;
    }

    // Example: mock user data (you can fetch from Supabase)
    const user = {
      id: officerId,
      phone,
      role: "officer",
    };

    // ✅ Store in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-[#0b2c64] mb-6 text-center">
          Officer Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Officer ID
          </label>
          <input
            type="text"
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0b2c64] focus:outline-none"
            placeholder="Enter your officer ID"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Phone Number
          </label>
          <input
            type="password"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0b2c64] focus:outline-none"
            placeholder="Enter your phone number"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0b2c64] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0a2958] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
