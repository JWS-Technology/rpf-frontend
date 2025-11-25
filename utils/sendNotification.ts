// utils/sendNotification.ts
import admin from "firebase-admin";

/**
 * Initialize Firebase Admin SDK.
 * Priority:
 * 1) environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */
function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    return;
  }

  throw new Error(
    `Firebase credentials not found. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars.`
  );
}

initFirebaseAdmin();

/** Chunk helper */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Sends FCM messages to multiple tokens using sendMulticast with automatic chunking.
 *
 * @param tokens string[]  Array of device tokens (required)
 * @param body string message body
 * @param options optional settings: title, channelId, data, apnsContentAvailable (boolean)
 */
export async function sendNotification(
  tokens: string[] | string,
  body: string = "New incident reported (default message).",
  options?: {
    title?: string;
    channelId?: string; // Android channelId (must be created on the device with high importance)
    data?: Record<string, string>;
    apnsContentAvailable?: boolean; // if true, keeps content-available:1 for background processing
  }
) {
  // normalize tokens to array
  const tokenArray = typeof tokens === "string" ? [tokens] : tokens;

  if (!Array.isArray(tokenArray) || tokenArray.length === 0) {
    console.warn("sendNotification: tokens must be a non-empty array.");
    return { success: false, error: "Missing or invalid tokens" };
  }

  const title = options?.title ?? "🚨 New Incident Reported!";
  const channelId = options?.channelId ?? "alerts_high";
  const extraData = options?.data ?? {};
  const apnsContentAvailable = !!options?.apnsContentAvailable;

  const commonPayload = {
    notification: {
      title,
      body,
    },
    data: {
      title,
      body,
      ...extraData,
    },
    android: {
      priority: "high" as const,
      notification: {
        channelId,
        sound: "default",
        visibility: "public" as const,
        defaultSound: true,
      },
    },
    apns: {
      headers: {
        "apns-priority": "10",
        "apns-push-type": "alert",
      },
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
          ...(apnsContentAvailable ? { "content-available": 1 } : {}),
        },
      },
    },
  };


  try {
    console.log("sending asdfbajsdbjkhasbfjhbasdjkhflbljk");
    
    // sendMulticast supports up to 500 tokens per call
    const MAX_PER_BATCH = 500;
    const tokenChunks = chunkArray(tokenArray, MAX_PER_BATCH);

    const aggregatedResponses: Array<{ success: boolean; response?: string; token?: string; error?: unknown }> = [];
    let totalSuccess = 0;

    for (const chunk of tokenChunks) {
      if (chunk.length === 1) {
        // For single-token chunk, use send() to preserve single-send response format
        const message = {
          ...commonPayload,
          token: chunk[0],
        };
        const res = await admin.messaging().send(message);
        aggregatedResponses.push({ success: true, response: res, token: chunk[0] });
        totalSuccess++;
      } else {
        // multicast - send multiple messages in parallel
        const sendPromises = chunk.map((token) => {
          const message = {
            ...commonPayload,
            token,
          };
          return admin.messaging().send(message);
        });

        const results = await Promise.allSettled(sendPromises);
        results.forEach((result, idx) => {
          const tk = chunk[idx];
          if (result.status === "fulfilled") {
            totalSuccess++;
            aggregatedResponses.push({ success: true, response: result.value, token: tk });
          } else {
            aggregatedResponses.push({ success: false, token: tk, error: result.reason });
          }
        });
      }
    }

    return { success: totalSuccess > 0, response: aggregatedResponses };
  } catch (error) {
    console.error("❌ FCM send error (critical):", error);
    return { success: false, error };
  }
}

// // utils/sendNotification.ts
// import admin from "firebase-admin";

// /**
//  * Initialize Firebase Admin SDK.
//  * Priority:
//  * 1) environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
//  */
// function initFirebaseAdmin() {
//   if (admin.apps.length) return;

//   const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

//   if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: FIREBASE_PROJECT_ID,
//         clientEmail: FIREBASE_CLIENT_EMAIL,
//         privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//       }),
//     });
//     return;
//   }

//   throw new Error(
//     `Firebase credentials not found. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars.`
//   );
// }

// initFirebaseAdmin();

// /**
//  * Sends an FCM message.
//  * - For heads-up on Android, server should set `android.notification.channelId` to a high-importance channel that exists on the device.
//  * - For visible alerts on iOS, include `apns.headers['apns-push-type']='alert'` and `aps.alert` in payload.
//  *
//  * @param tokens string | string[]  single device token or array of device tokens
//  * @param body string message body
//  * @param options optional settings: title, channelId, data, apnsContentAvailable (boolean)
//  */
// export async function sendNotification(
//   tokens: string | string[] = "PASTE_FCM_DEVICE_TOKEN_HERE",
//   body: string = "New incident reported (default message).",
//   options?: {
//     title?: string;
//     channelId?: string; // Android channelId (must be created on the device with high importance)
//     data?: Record<string, string>;
//     apnsContentAvailable?: boolean; // if true, keeps content-available:1 for background processing
//   }
// ) {
//   if (
//     !tokens ||
//     (Array.isArray(tokens) && tokens.length === 0) ||
//     (typeof tokens === "string" && tokens === "PASTE_FCM_DEVICE_TOKEN_HERE")
//   ) {
//     console.warn("sendNotification: tokens are missing, empty, or placeholder. Aborting send.");
//     return { success: false, error: "Missing or invalid tokens" };
//   }

//   const title = options?.title ?? "🚨 New Incident Reported!";
//   const channelId = options?.channelId ?? "alerts_high"; // sensible default; device must create this channel
//   const extraData = options?.data ?? {};
//   const apnsContentAvailable = !!options?.apnsContentAvailable;

//   const commonMessageConfig: Partial<admin.messaging.Message> = {
//     notification: {
//       title,
//       body,
//     },
//     data: {
//       title,
//       body,
//       ...extraData,
//     },
//     android: {
//       priority: "high",
//       notification: {
//         channelId,
//         sound: "default",
//         // visibility and defaults that help heads-up behavior
//         visibility: "public",
//         defaultSound: true,
//       },
//     },
//     apns: {
//       headers: {
//         "apns-priority": "10",
//         "apns-push-type": "alert", // required on newer iOS
//       },
//       payload: {
//         aps: {
//           alert: { title, body },
//           sound: "default",
//           // Optional: interruption-level can help (iOS 15+)
//           // "interruption-level": "time-sensitive",
//           // include content-available only if you need background processing
//           ...(apnsContentAvailable ? { "content-available": 1 } : {}),
//         },
//       },
//     },
//   };

//   try {
//     if (Array.isArray(tokens)) {
//       const sendPromises = tokens.map((token) => {
//         const message = {
//           ...commonMessageConfig,
//           token,
//         };
//         return admin.messaging().send(message);
//       });

//       const results = await Promise.allSettled(sendPromises);

//       let successCount = 0;
//       let failureCount = 0;
//       const responses: Array<{ success: boolean; response?: string; token?: string; error?: unknown }> = [];

//       results.forEach((result, idx) => {
//         if (result.status === "fulfilled") {
//           successCount++;
//           responses.push({ success: true, response: result.value, token: tokens[idx] });
//         } else {
//           failureCount++;
//           responses.push({ success: false, token: tokens[idx], error: result.reason });
//         }
//       });

//       return { success: successCount > 0, response: responses };
//     } else {
//       const message = {
//         ...commonMessageConfig,
//         token: tokens,
//       };
//       const res = await admin.messaging().send(message);
//       return { success: true, response: res };
//     }
//   } catch (error) {
//     console.error("❌ FCM send error (critical):", error);
//     return { success: false, error };
//   }
// }
