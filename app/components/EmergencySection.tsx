"use client";
import React, { useState } from "react";
import { Mic, Camera, RotateCw, CheckCircle, OctagonAlert } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { clearAllData } from "@/lib/features/sos-data/sosSlice";
import axios from "axios";
import { RootState } from "@/lib/store";

type EmergencySectionProps = {
  onAudioRecorded?: (blob: Blob | null) => void;
  onPhotoSelected?: (file: File | null) => void;
  onSubmit?: (data: { audio?: Blob | null; photo?: File | null }) => void;
  submitDisabled?: boolean;
};

export default function EmergencySection({
  onAudioRecorded,
  onPhotoSelected,
  onSubmit,
  submitDisabled = false,
}: EmergencySectionProps) {
  const dispatch = useDispatch();

  const issue_type = useSelector((state: RootState) => state.sos.issue_type);
  const phone_number = useSelector(
    (state: RootState) => state.sos.phone_number
  );
  const station = useSelector((state: RootState) => state.sos.station);

  const [isLoading, setisLoading] = useState<boolean>(false);

  const [isRecording, setIsRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [audioURL, setAudioURL] = React.useState<string | null>(null);

  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoURL, setPhotoURL] = React.useState<string | null>(null);

  const reqHelp = async () => {
    try {
      setisLoading(true);
      const formData = new FormData();
      formData.append("issue_type", issue_type);
      formData.append("phone_number", phone_number);
      formData.append("station", station);
      setTimeout(() => {
        setisLoading(false);
      }, 3000);
      // const res = await axios.post("/api/sos", formData);
      // console.log(res);
    } catch (error) {
      setisLoading(false);

      // console.log("error in issue submit" + error);
    }
  };

  const pickMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
    ];
    for (const m of candidates) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m))
        return m;
    }
    return "";
  };

  React.useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
      if (photoURL) URL.revokeObjectURL(photoURL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    if (audioBlob) {
      const u = URL.createObjectURL(audioBlob);
      setAudioURL(u);
    }
    onAudioRecorded?.(audioBlob);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  React.useEffect(() => {
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
      setPhotoURL(null);
    }
    if (photoFile) {
      const u = URL.createObjectURL(photoFile);
      setPhotoURL(u);
    }
    onPhotoSelected?.(photoFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoFile]);

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMimeType();
      const mr = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunks, {
          type: chunks[0]?.type || "audio/webm",
        });
        setAudioChunks(chunks);
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setMediaRecorder(mr);
      setAudioChunks([]);
      setIsRecording(true);
    } catch (err) {
      console.error("microphone access denied or unavailable", err);
      alert(
        "Microphone unavailable. Please allow microphone permission or use upload."
      );
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    try {
      mediaRecorder.stop();
    } catch (e) {
      console.warn("error stopping mediaRecorder", e);
    }
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
      return;
    }
    setPhotoFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handlePhotoChange(file ?? undefined);
    e.currentTarget.value = "";
  };

  const handleReset = () => {
    dispatch(clearAllData());
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
      setPhotoURL(null);
    }
    setAudioChunks([]);
    setAudioBlob(null);
    setPhotoFile(null);
    setIsRecording(false);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
      } catch {
        // ignore
      }
      setMediaRecorder(null);
    }
    onAudioRecorded?.(null);
    onPhotoSelected?.(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (submitDisabled) return;
    onSubmit?.({
      audio: audioBlob ?? undefined,
      photo: photoFile ?? undefined,
    });
  };

  // Only show preview container if there is audio or photo
  const showPreview = Boolean(audioURL || photoURL);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl space-y-6 border-2 border-blue-100">
      {/* Emergency Banner */}
      <div className="bg-rose-600 text-rose-200 rounded-md py-4">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-5 font-semibold text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-10">
            <OctagonAlert size={40} />
            <span className="uppercase text-md sm:text-xl">EMERGENCY</span>
            <OctagonAlert size={40} />
          </div>

          {/* 🩸 Subtext / Description */}
          <p className="text-sm sm:text-base text-rose-100 font-normal mt-0 px-4">
            In case of emergency, record audio.
            <br />
            आपात स्थिति में ऑडियो रिकॉर्ड करें।
          </p>
        </div>
      </div>

      {/* Actions Row (Record / Upload) */}
      <div className="">
        {/* Record Audio Card */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleRecordToggle();
          }}
          className={`flex items-center justify-center gap-3 p-6 rounded-lg border-2 border-[#234b74] cursor-pointer select-none ${isRecording ? "bg-[#234b74] text-white" : "bg-white text-[#0b3b66]"
            }`}
          onClick={handleRecordToggle}
          aria-pressed={isRecording}
          aria-label={isRecording ? "Stop recording" : "Record audio"}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-md ${isRecording ? "bg-white/20" : "bg-white/5"
                }`}
            >
              <Mic
                className={`w-6 h-6 ${isRecording ? "text-white" : "text-[#0b3b66]"
                  }`}
              />
            </div>
            <div className="text-center">
              <div className="font-semibold">
                {isRecording ? "Stop Recording" : "Record Audio"}
              </div>
              <div className="text-sm">
                {isRecording ? "Recording..." : "ऑडियो रिकॉर्ड करें"}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Photo Card */}
        {/* <label
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
        </label> */}
      </div>

      {/* Conditionally-rendered Preview area: appears only when there is content */}
      {showPreview && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Audio preview (only if present) */}
          {audioURL && (
            <div className="p-3 border rounded-md flex-1">
              <div className="font-medium mb-2">Audio Preview</div>
              <div className="space-y-2">
                <audio
                  key={audioURL}
                  controls
                  playsInline
                  src={audioURL}
                  className="w-full"
                />
                <div className="flex items-center gap-3 text-sm">
                  <a
                    href={audioURL}
                    download={`recording-${Date.now()}.webm`}
                    className="underline"
                  >
                    Download audio
                  </a>
                  <span className="text-gray-500">
                    {audioBlob ? `${Math.round(audioBlob.size / 1024)} KB` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Photo preview (only if present) */}
          {photoURL && (
            <div className="p-3 border rounded-md flex-1">
              <div className="font-medium mb-2">Photo Preview</div>
              {/* <img src={photoURL} alt="Preview" className="max-h-64 w-full object-contain rounded-md" /> */}
              <Image
                height={100}
                width={100}
                src={photoURL}
                alt="Preview"
                className="max-h-64 w-full object-contain rounded-md"
              />
            </div>
          )}
        </div>
      )}

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
          // onClick={handleSubmit}
          onClick={reqHelp}
          disabled={submitDisabled}
          className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg text-white ${submitDisabled
              ? "bg-green-300 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          aria-label="Submit Complaint / शिकायत दर्ज करें"
        >

          {isLoading ? (
            <div className="flex gap-3 items-center justify-center">
              <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <h1 className="font-semibold">Loading...</h1>
            </div>
          ) : (
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">
                SUBMIT COMPLAINT / शिकायत दर्ज करें
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
