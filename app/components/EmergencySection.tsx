'use client';
import React from 'react';
import { Mic, Camera, RotateCw, CheckCircle, OctagonAlert } from 'lucide-react';

type EmergencySectionProps = {
  /** Called when an audio blob is recorded (or recording stopped) */
  onAudioRecorded?: (blob: Blob | null) => void;
  /** Called when a photo file is selected */
  onPhotoSelected?: (file: File | null) => void;
  /** Called when user presses submit; returns collected data (audio blob, photo file) */
  onSubmit?: (data: { audio?: Blob | null; photo?: File | null }) => void;
  /** Optional: initial disabled state for submit */
  submitDisabled?: boolean;
};

export default function EmergencySection({
  onAudioRecorded,
  onPhotoSelected,
  onSubmit,
  submitDisabled = false,
}: EmergencySectionProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);

  // Start recording using MediaRecorder
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioChunks(chunks);
        setAudioBlob(blob);
        onAudioRecorded?.(blob);
        // stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setMediaRecorder(mr);
      setAudioChunks([]);
      setIsRecording(true);
    } catch (err) {
      console.error('microphone access denied or unavailable', err);
      alert('Microphone unavailable. Please allow microphone permission or use upload.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setMediaRecorder(null);
    setIsRecording(false);
  };

  const handleRecordToggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handlePhotoChange = (file?: File) => {
    if (!file) {
      setPhotoFile(null);
      onPhotoSelected?.(null);
      return;
    }
    setPhotoFile(file);
    onPhotoSelected?.(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handlePhotoChange(file ?? undefined);
    // reset input to allow same file re-select
    e.currentTarget.value = '';
  };

  const handleReset = () => {
    // clear audio and photo
    setAudioChunks([]);
    setAudioBlob(null);
    setPhotoFile(null);
    setIsRecording(false);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    onAudioRecorded?.(null);
    onPhotoSelected?.(null);
  };

  const handleSubmit = () => {
    if (submitDisabled) return;
    onSubmit?.({ audio: audioBlob ?? undefined, photo: photoFile ?? undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto space-y-6 border-2 border-blue-100">
      {/* Emergency Banner */}
      <div className="bg-rose-600 text-rose-200 rounded-md p-4 flex items-center justify-center gap-3">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <OctagonAlert size={40} />
          <span className="uppercase text-xl">EMERGENCY / आपातकालीन</span>
          <OctagonAlert size={40} />
        </div>
      </div>

      {/* Actions Row (Record / Upload) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Record Audio Card */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleRecordToggle();
          }}
          className={`flex items-center justify-center gap-3 p-6 rounded-lg border-2 border-[#234b74] cursor-pointer select-none ${
            isRecording ? 'bg-[#234b74] text-white' : 'bg-white text-[#0b3b66]'
          }`}
          onClick={handleRecordToggle}
          aria-pressed={isRecording}
          aria-label={isRecording ? 'Stop recording' : 'Record audio'}
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-md ${isRecording ? 'bg-white/20' : 'bg-white/5'}`}>
              <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-[#0b3b66]'}`} />
            </div>
            <div className="text-center">
              <div className="font-semibold">{isRecording ? 'Stop Recording' : 'Record Audio'}</div>
              <div className="text-sm">{isRecording ? 'Recording...' : 'ऑडियो रिकॉर्ड करें'}</div>
            </div>
          </div>
        </div>

        {/* Upload Photo Card */}
        <label
          htmlFor="photo-upload"
          className="flex items-center justify-center gap-3 p-6 rounded-lg border-2 border-[#234b74] cursor-pointer select-none bg-white text-[#0b3b66]"
        >
          <div className="p-3 rounded-md bg-white/5">
            <Camera className="w-6 h-6 text-[#0b3b66]" />
          </div>
          <div className="text-center">
            <div className="font-semibold">Upload Photo</div>
            <div className="text-sm">फोटो अपलोड करें</div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="sr-only"
            />
            {photoFile && <div className="text-xs mt-2 text-gray-600">Selected: {photoFile.name}</div>}
          </div>
        </label>
      </div>

      {/* Footer Actions (Reset / Submit) */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 bg-white text-[#0b3b66] hover:bg-gray-50"
          aria-label="Reset / रीसेट करें"
        >
          <RotateCw className="w-5 h-5" />
          Reset / रीसेट करें
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitDisabled}
          className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg text-white ${
            submitDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
          aria-label="Submit Complaint / शिकायत दर्ज करें"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">SUBMIT COMPLAINT / शिकायत दर्ज करें</span>
        </button>
      </div>

      {/* Optional preview area */}
      <div className="text-sm text-gray-600">
        {audioBlob ? (
          <div className="flex items-center gap-3">
            <audio controls src={URL.createObjectURL(audioBlob)} />
            <div className="text-xs">Recorded audio ready</div>
          </div>
        ) : (
          <div className="text-xs">No recording</div>
        )}
      </div>
    </div>
  );
}
