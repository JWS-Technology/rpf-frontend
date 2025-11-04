"use client";

import { User, ArrowUp, UserPlus, CheckCircle } from "lucide-react";

export default function ActionsPanel({ incident }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
      {/* Header */}
      <h3 className="text-lg font-semibold text-[#0b2c64] mb-4">Actions</h3>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Reassign */}
        <button className="flex items-center justify-center gap-2 w-full bg-[#f8fafc] text-[#0b2c64] py-2.5 rounded-lg font-medium border border-[#e2e8f0] hover:bg-[#e2eefa] transition">
          <UserPlus size={16} />
          Reassign
        </button>

        {/* Escalate */}
        <button className="flex items-center justify-center gap-2 w-full bg-[#dc2626] text-white py-2.5 rounded-lg font-medium hover:bg-[#b91c1c] transition">
          <ArrowUp size={16} />
          Escalate
        </button>

        {/* Mark Resolved */}
        <button className="flex items-center justify-center gap-2 w-full bg-[#22c55e] text-white py-2.5 rounded-lg font-medium hover:bg-[#16a34a] transition">
          <CheckCircle size={16} />
          Mark Resolved
        </button>
      </div>

      {/* SLA Status Section */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-[#0b2c64] mb-1">SLA Status</p>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Elapsed</span>
          <span className="font-medium text-[#0b2c64]">120 mins</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Target</span>
          <span className="font-medium text-[#0b2c64]">15 mins</span>
        </div>

        {/* Red Progress Bar */}
        <div className="mt-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#dc2626] h-1.5 w-[90%] rounded-full"></div>
        </div>
      </div>

      {/* Assigned To Section */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-[#0b2c64] mb-2">Assigned To</p>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#0b2c64] text-white flex items-center justify-center">
            <span className="font-semibold">
              {incident.assignedTo?.charAt(0) || "H"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#0b2c64]">
              {incident.assignedTo || "HC Priya Sharma"}
            </p>
            <p className="text-xs text-gray-500">{incident.role || "RPF Personnel"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
