"use client";

export default function IncidentDetails({ incident }: any) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      {/* Header */}
      <h2 className="text-xl font-semibold text-[#0b2c64] border-b border-gray-200 pb-3 mb-5">
        Incident Details
      </h2>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Type */}
        <div>
          <p className="text-gray-500 font-medium mb-1">Type</p>
          <p className="bg-[#e8effc] text-[#0b2c64] font-semibold px-3 py-2 rounded-lg inline-block">
            {incident.type || "N/A"}
          </p>
        </div>

        {/* Status */}
        {incident.status && (
          <div>
            <p className="text-gray-500 font-medium mb-1">Status</p>
            <p
              className={`px-3 py-2 rounded-lg inline-block font-semibold ${
                incident.status === "Open"
                  ? "bg-green-100 text-green-700"
                  : incident.status === "Closed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {incident.status}
            </p>
          </div>
        )}

        {/* Complainant Name */}
        {incident.complainant_name && (
          <div>
            <p className="text-gray-500 font-medium mb-1">Complainant Name</p>
            <p className="text-gray-800 font-medium">
              {incident.complainant_name}
            </p>
          </div>
        )}

        {/* Complainant Phone */}
        {incident.phone_number && (
          <div>
            <p className="text-gray-500 font-medium mb-1">Complainant Phone</p>
            <a
              href={`tel:+91${incident.phone_number}`}
              className="inline-flex items-center gap-2 bg-[#f5f7fb] hover:bg-[#e8effc] px-3 py-2 rounded-lg text-gray-800 font-mono transition-all duration-200"
            >
              📞 +91 {incident.phone_number}
            </a>
          </div>
        )}

        {/* Location */}
        {incident.location && (
          <div className="sm:col-span-2">
            <p className="text-gray-500 font-medium mb-1">Location</p>
            <p className="text-gray-800 font-medium bg-gray-50 px-3 py-2 rounded-lg">
              {incident.location}
            </p>
          </div>
        )}

        {/* Description */}
        {incident.description && (
          <div className="sm:col-span-2">
            <p className="text-gray-500 font-medium mb-1">Description</p>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg leading-relaxed">
              {incident.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
