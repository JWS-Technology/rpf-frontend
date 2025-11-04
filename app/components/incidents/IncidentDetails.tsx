"use client";

export default function IncidentDetails({ incident }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#0b2c64] mb-4">
        Incident Details
      </h2>

      <div className="space-y-4 text-sm">
        {/* Type */}
        <div>
          <p className="text-[#0b2c64] font-medium">Type</p>
          <p className="text-gray-700 bg-[#e8effc] inline-block px-3 py-1 rounded-lg font-semibold">
            {incident.type}
          </p>
        </div>

        {/* Description */}
        <div>
          <p className="text-[#0b2c64] font-medium">Description</p>
          <p className="text-gray-700">{incident.description}</p>
        </div>

        {/* Complainant Phone */}
        <div>
          <p className="text-[#0b2c64] font-medium">Complainant Phone</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700 font-mono">
              {incident.phone}
            </span>
            <button className="text-[#0b2c64] text-sm font-medium underline hover:text-[#092659]">
              Reveal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
