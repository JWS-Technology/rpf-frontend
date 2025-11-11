// utils/sendNotification.ts
import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

const FILE_NAME = "rpfpolice-firebase-adminsdk-fbsvc-81888894b9.json";

// Try to resolve JSON path inside the utils folder (project-root/utils/FILE_NAME)
const jsonPath = path.join(process.cwd(), "utils", FILE_NAME);

/**
 * Initialize Firebase Admin SDK.
 * Priority:
 *  1) service account JSON at project-root/utils/<FILE_NAME>
 *  2) environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  try {
    // 1) Try to load JSON file
    const raw = readFileSync(jsonPath, { encoding: "utf8" });
    const serviceAccount = JSON.parse(raw);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized from JSON:", jsonPath);
    return;
  } catch (err) {
    console.warn("ℹ️ Firebase JSON not found or unreadable at", jsonPath);
  }

  // 2) Fallback to env vars (suitable for Vercel / production)
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // replace literal \n into newlines if stored that way
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("✅ Firebase Admin initialized from environment variables.");
    return;
  }

  // If we reach here, neither JSON nor env vars are available — throw a helpful error.
  throw new Error(
    `Firebase credentials not found. Place ${FILE_NAME} in project-root/utils/ or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars.`
  );
}

initFirebaseAdmin();

/**
 * Sends a data-only FCM message.
 * token: device token
 * body: message body (optional)
 * station: station name (optional)
 */
export async function sendNotification(
  token: string = "PASTE_FCM_DEVICE_TOKEN_HERE",
  body: string = "New incident reported (default message).",
  // station: string = "Default Station"
) {
  if (!token || token === "PASTE_FCM_DEVICE_TOKEN_HERE") {
    console.warn("sendNotification: token is missing or placeholder. Aborting send.");
    return { success: false, error: "Missing token" };
  }

  const message = {
    data: {
      title: "🚨 New Incident Reported!",
      body,
      // station,
    },
    token,
  };

  try {
    const res = await admin.messaging().send(message);
    console.log("✅ FCM send result:", res);
    return { success: true, response: res };
  } catch (error) {
    console.error("❌ FCM send error:", error);
    return { success: false, error };
  }
}
