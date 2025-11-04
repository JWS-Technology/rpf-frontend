"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

export default function AddNote() {
  const [note, setNote] = useState("");

  const handleAddNote = () => {
    if (!note.trim()) return;
    console.log("Note added:", note);
    setNote("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-[#0b2c64] mb-3">Add Note</h3>

      {/* Textarea */}
      <textarea
        className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#0b2c64] focus:outline-none transition"
        rows={4}
        placeholder="Add additional information or instructions..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleAddNote}
        className="mt-4 flex items-center gap-2 bg-[#0b2c64] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#092659] transition"
      >
        <FileText size={16} />
        Add Note
      </button>
    </div>
  );
}
