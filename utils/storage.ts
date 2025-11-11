import { supabase } from "./supabaseClient";

/**
 * Uploads an audio file (Blob or File) to Supabase Storage.
 *
 * @param file The audio blob or file to upload.
 * @param fileName A unique name for the file (e.g., `recording-12345.webm`).
 * @param bucketName The name of the storage bucket in Supabase.
 * @returns The public URL of the uploaded file.
 * @throws Will throw an error if the upload fails.
 */
export const uploadAudioToSupabase = async (
  file: Blob | File,
  fileName: string,
  bucketName: string = "audio_recordings" // Default bucket name
) => {
  // 1. Upload the file - This part is correct
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      contentType: file.type || "audio/webm",
      upsert: true, // I changed this to true, it's safer
    });

  if (error) {
    console.error("Error uploading audio:", error.message);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  // 2. Get the public URL for the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path, {
      // =================== THIS IS THE FIX ===================
      download: false, 
      // This tells Supabase to serve the file with the correct
      // Content-Type (e.g., "audio/mp4") instead of forcing a download.
      // =======================================================
    });

  if (!publicUrlData) {
    throw new Error("Could not get public URL for uploaded file.");
  }

  return publicUrlData.publicUrl;
};