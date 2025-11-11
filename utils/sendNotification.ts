// utils/sendNotification.ts
import admin from "firebase-admin";

/**
 * Initialize Firebase Admin SDK.
 * Priority:
 * 1) environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  // 1) Load from env vars (suitable for Vercel / production)
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
    // console.log("✅ Firebase Admin initialized from environment variables.");
    return;
  }

  // If we reach here, env vars are not available — throw a helpful error.
  throw new Error(
    `Firebase credentials not found. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars.`
  );
}

initFirebaseAdmin();

/**
 * Sends a data-only FCM message.
 * @param tokens A single device token (string) or an array of device tokens (string[]).
 * @param body Message body (optional).
 */
export async function sendNotification(
  tokens: string | string[] = "PASTE_FCM_DEVICE_TOKEN_HERE",
  body: string = "New incident reported (default message)."
) {
  // Validate tokens input
  if (
    !tokens ||
    (Array.isArray(tokens) && tokens.length === 0) ||
    (typeof tokens === "string" && tokens === "PASTE_FCM_DEVICE_TOKEN_HERE")
  ) {
    console.warn("sendNotification: tokens are missing, empty, or placeholder. Aborting send.");
    return { success: false, error: "Missing or invalid tokens" };
  }

  // Define the common message payload
  const messagePayload = {
    data: {
      title: "🚨 New Incident Reported!",
      body,
      // station, // This was commented out in your original, so I kept it
    },
  };

  try {
    if (Array.isArray(tokens)) {
      // --- Handle MULTIPLE tokens (Alternative to multicast) ---
      // Create an array of promises, one for each token
      const sendPromises = tokens.map((token) => {
        const message = {
          data: messagePayload.data,
          token: token,
        };
        return admin.messaging().send(message);
      });

      // Use Promise.allSettled to send all, even if some fail
      const results = await Promise.allSettled(sendPromises);

      let successCount = 0;
      let failureCount = 0;
      const responses: Array<{ success: boolean; response?: string; token?: string; error?: unknown }> = [];
      
      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          successCount++;
          responses.push({ success: true, response: result.value });
        } else {
          // 'result.status' is "rejected"
          failureCount++;
          const failedToken = tokens[idx];
          // console.error(`Failed to send to token: ${failedToken}`, result.reason);
          responses.push({ success: false, token: failedToken, error: result.reason });
        }
      });
      
      // console.log(`✅ FCM send complete: ${successCount} success, ${failureCount} failure`);
      return { success: successCount > 0, response: responses };

    } else {
      // --- Handle SINGLE token ---
      // Use send for a single token string
      const message = {
        data: messagePayload.data,
        token: tokens, // 'token' (singular)
      };
      const res = await admin.messaging().send(message);
      // console.log("✅ FCM send result (Message ID):", res);
      return { success: true, response: res }; // 'res' is a string (messageId)
    }
  } catch (error) {
    // This catch block will now mainly catch initialization errors, 
    // as individual send errors are handled by Promise.allSettled
    console.error("❌ FCM send error (critical):", error);
    return { success: false, error };
  }
}