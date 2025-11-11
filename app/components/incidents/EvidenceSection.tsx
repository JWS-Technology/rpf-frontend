"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  audioUrl?: string | null;
  recordedAt?: string;
}

export default function EvidenceSection({
  audioUrl,
  recordedAt = "kiosk",
}: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Clean up and normalize audio URL
    const cleaned =
      audioUrl && audioUrl.trim().toLowerCase() !== "nil" && audioUrl.trim() !== ""
        ? audioUrl.trim()
        : null;

    setSrc(cleaned);

    // reload player if audio changes
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  // Extract filename from the URL
  const fileNameFromUrl = (u?: string | null) => {
    if (!u) return null;
    try {
      const p = new URL(u, typeof window !== "undefined" ? window.location.origin : undefined);
      return decodeURIComponent(p.pathname.split("/").pop() || p.hostname);
    } catch {
      const parts = (u || "").split("/");
      return decodeURIComponent(parts[parts.length - 1] || u);
    }
  };

  const fileName = fileNameFromUrl(src);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Evidence</h2>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium mb-1">Audio Recording</p>

          {src ? (
            <div className="space-y-2">
              <audio
                ref={audioRef}
                controls
                key={src}
                className="w-full rounded"
              >
                <source src={src} />
                Your browser does not support the audio element.
              </audio>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{fileName ?? "Audio file"}</span>
                <span>Recorded at {recordedAt}</span>
              </div>

              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                download
                className="text-xs px-3 py-1 border rounded-md bg-white hover:bg-gray-50 inline-block"
              >
                Download
              </a>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No audio recorded for this incident.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
