"use client";

import { useParams } from "next/navigation";
import IncidentHeader from "../../components/incidents/IncidentHeader";
import IncidentDetails from "../../components/incidents/IncidentDetails";
import EvidenceSection from "../../components/incidents/EvidenceSection";
import IncidentTimeline from "../../components/incidents/IncidentTimeline";
import AddNote from "../../components/incidents/AddNote";
import ActionsPanel from "../../components/incidents/ActionsPanel";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function IncidentPage() {
  const { id } = useParams();

  // Dummy data
  const incident = {
    id,
    title: "RPF-2025-0003",
    status: "IN-PROGRESS",
    severity: "HIGH",
    slaBreach: true,
    location: "New Delhi (NDLS)",
    timestamp: "10/27/2025, 9:00:10 PM",
    type: "Harassment",
    description:
      "Female passenger reports harassment by group of men. Immediate assistance requested.",
    phone: "98xxxx9012",
    kiosk: "KIOSK-WAYSIDE-03",
    platform: "10",
    assignedTo: "HC Priya Sharma",
    role: "RPF Personnel",
  };

  return (
    <div className="min-h-screen bg-[#f1f6f9] text-[#0b2c64]">

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* Header card: full-width white card with subtle border & rounded corners */}

        <div className="pt-6">
 <Link
  href="/dashboard"
  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg 
             text-[#0b2c64] font-medium bg-transparent
             hover:bg-[#dbeafe] transition-colors duration-200 mt-4"
>
  <ChevronLeft className="h-4 w-4" />
  Back to Dashboard
</Link>

</div>


        <section className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-5 mt-6">
          <IncidentHeader incident={incident} />
        </section>

        {/* Main two-column layout below header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left - large stacked panels (span 2 on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Details large card */}
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-6">
              <IncidentDetails incident={incident} />
            </div>

            {/* Evidence card */}
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-6">
              <EvidenceSection />
            </div>

            {/* Timeline card */}
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-6">
              <IncidentTimeline />
            </div>

            {/* Add note card */}
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-6">
              <AddNote />
            </div>
          </div>

          {/* Right - Actions column */}
          <aside className="lg:col-span-1">
            {/* Outer wrapper card to match screenshot (rounded + border) */}
            <div className="bg-white border border-[#e6edf3] rounded-xl shadow-sm p-5 sticky top-6">
              {/* Inner inset card so the actions block looks like an inset panel like your screenshot */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#0b2c64] mb-4">Actions</h3>

                {/* ActionsPanel component renders the buttons, SLA, assignee etc */}
                <ActionsPanel incident={incident} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
