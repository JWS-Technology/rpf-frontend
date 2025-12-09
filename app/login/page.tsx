"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [officerId, setOfficerId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!officerId.trim() || !phone.trim()) {
      setError("Please enter Officer ID and Phone Number");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerId, phone }),
      });

      if (!res.ok) {
        // try reading text first to debug
        const text = await res.text();
        console.error("Server returned error:", text);
        setError("Login failed: " + (text || res.statusText));
        return;
      }

      const data = await res.json(); // safe now

      // ✅ Save officer info in localStorage (or sessionStorage)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Server error, please try again later.");
    }
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
            Password
          </label>
          <input
            type="password"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0b2c64] focus:outline-none"
            placeholder="Enter your password"
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
