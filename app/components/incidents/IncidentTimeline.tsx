"use client";

const timeline = [
  { label: "RECEIVED", by: "System", time: "7 days ago" },
  { label: "ACKNOWLEDGED", by: "Operator B", time: "7 days ago" },
  { label: "ASSIGNED", by: "Operator B", time: "7 days ago" },
  { label: "ON SCENE", by: "HC Priya Sharma", time: "7 days ago" },
];

export default function IncidentTimeline() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0b2c64] mb-4">
        Incident Timeline
      </h2>

      <ul className="relative pl-4 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-px before:bg-[#0b2c64]/20">
        {timeline.map((item, i) => (
          <li key={i} className="relative flex justify-between pl-4">
            {/* Timeline Dot */}
            <span className="absolute -left-[0.55rem] top-1.5 h-3 w-3 rounded-full bg-[#0b2c64] border-2 border-white"></span>

            {/* Content */}
            <div>
              <p className="text-sm font-semibold text-[#0b2c64]">
                {item.label}
              </p>
              <p className="text-xs text-gray-500">{item.by}</p>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-400">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
