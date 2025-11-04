export default function EvidenceSection() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Evidence</h2>

      <div className="space-y-2">
        <p className="text-sm font-medium">Audio Recording</p>
        <audio controls className="w-full rounded">
          <source src="/sample-audio.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <p className="text-xs text-gray-500">Recorded at kiosk</p>
      </div>
    </div>
  );
}
