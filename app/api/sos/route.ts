import { connect } from "@/dbconfig/db";
import Incident from "@/models/incident.model";
import { sendNotification } from "@/utils/sendNotification";
import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";
import Device from "@/models/device.model";

export async function POST(req: NextRequest) {
  await connect();
  try {
    const formData = await req.formData();
    const issue_type = formData.get("issue_type");
    const phone_number = formData.get("phone_number");
    const station = formData.get("station");
    const audio_url = formData.get("audio_url");

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = Twilio(accountSid, authToken);

    let mediaUrlToSend: string[] | undefined = undefined;
    if (typeof audio_url === "string") {
      mediaUrlToSend = [audio_url];
    }

    if (issue_type === "EMERGENCY") {
      const newIncident = new Incident({
        issue_type,
        station,
        audio_url,
      });
      await newIncident.save();

      const latestDevice = await Device.findOne().sort({ createdAt: -1 });
      sendNotification(latestDevice.device_token);

      const formattedBody = `
      New Incident Report Submitted:

      Issue: ${issue_type}
      Location/Station: ${station}

      Please take immediate action.
    `;

      const message = await client.messages.create({
        from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
        body: formattedBody,
        // body: "Hello! This is noel sebu.",
        to: `${process.env.TO_WHATSAPP_NUMBER}`,
      });
      //

      const audioMessage = await client.messages.create({
        from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
        // body: formattedBody,
        // body: "Hello! This is noel sebu.",
        mediaUrl: mediaUrlToSend,
        to: `${process.env.TO_WHATSAPP_NUMBER}`,
      });

      return NextResponse.json(
        { message: "message successfully sent", success: true },
        { status: 200 }
      );
    }

    if (issue_type) {
      const newIncident = new Incident({
        issue_type,
        phone_number,
        station,
        audio_url,
      });
      await newIncident.save();

      const latestDevice = await Device.findOne().sort({ createdAt: -1 });
      sendNotification(latestDevice.device_token);

      const formattedBody = `
      New Incident Report Submitted:

      Issue: ${issue_type}
      Call now: ${phone_number}
      Location/Station: ${station}

      Please take immediate action.
    `;

      const message = await client.messages.create({
        from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
        body: formattedBody,
        // body: "Hello! This is noel sebu.",
        to: `${process.env.TO_WHATSAPP_NUMBER}`,
      });
      // console.log("✅ Message SID:", message.sid);

      if (mediaUrlToSend) {
        console.log("sending audio");
        console.log(audio_url);

        const audioMessage = await client.messages.create({
          from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
          // body: formattedBody,
          // body: "Hello! This is noel sebu.",
          mediaUrl: mediaUrlToSend,
          to: `${process.env.TO_WHATSAPP_NUMBER}`,
        });
        // console.log("✅ Message SID:", audioMessage.sid);
      }
    }

    return NextResponse.json(
      { message: "message successfully sent", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return NextResponse.json(
      { message: "some error in sos backend", success: false },
      { status: 400 }
    );
  }
}
// import { connect } from "@/dbconfig/db";
// import Incident from "@/models/incident.model";
// import { NextRequest, NextResponse } from "next/server";
// import Twilio from "twilio";
// export async function POST(req: NextRequest) {
//   await connect();
//   try {
//     const formData = await req.formData();
//     const issue_type = formData.get("issue_type");
//     const phone_number = formData.get("phone_number");
//     const station = formData.get("station");
//     const audio_url = formData.get("audio_url");

//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const client = Twilio(accountSid, authToken);

//     let mediaUrlToSend: string[] | undefined = undefined;
//     if (typeof audio_url === "string") {
//       mediaUrlToSend = [audio_url];
//     }

//     if (issue_type === "EMERGENCY") {
//       const newIncident = new Incident({
//         issue_type,
//         station,
//         audio_url,
//       });
//       await newIncident.save();

//       const formattedBody = `
//       New Incident Report Submitted:

//       Issue: ${issue_type}
//       Location/Station: ${station}

//       Please take immediate action.
//     `;

//       const message = await client.messages.create({
//         from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
//         body: formattedBody,
//         // body: "Hello! This is noel sebu.",
//         to: `${process.env.TO_WHATSAPP_NUMBER}`,
//       });
//       //

//       const audioMessage = await client.messages.create({
//         from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
//         // body: formattedBody,
//         // body: "Hello! This is noel sebu.",
//         mediaUrl: mediaUrlToSend,
//         to: `${process.env.TO_WHATSAPP_NUMBER}`,
//       });

//       return NextResponse.json(
//         { message: "message successfully sent", success: true },
//         { status: 200 }
//       );
//     }

//     if (issue_type) {
//       const newIncident = new Incident({
//         issue_type,
//         phone_number,
//         station,
//         audio_url,
//       });
//       await newIncident.save();

//       const formattedBody = `
//       New Incident Report Submitted:

//       Issue: ${issue_type}
//       Call now: ${phone_number}
//       Location/Station: ${station}

//       Please take immediate action.
//     `;

//       const message = await client.messages.create({
//         from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
//         body: formattedBody,
//         // body: "Hello! This is noel sebu.",
//         to: `${process.env.TO_WHATSAPP_NUMBER}`,
//       });
//       // console.log("✅ Message SID:", message.sid);

//       if (mediaUrlToSend) {
//         console.log("sending audio");
//         console.log(audio_url);

//         const audioMessage = await client.messages.create({
//           from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
//           // body: formattedBody,
//           // body: "Hello! This is noel sebu.",
//           mediaUrl: mediaUrlToSend,
//           to: `${process.env.TO_WHATSAPP_NUMBER}`,
//         });
//         // console.log("✅ Message SID:", audioMessage.sid);
//       }
//     }

//     return NextResponse.json(
//       { message: "message successfully sent", success: true },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Error sending message:", error);
//     return NextResponse.json(
//       { message: "some error in sos backend", success: false },
//       { status: 400 }
//     );
//   }
// }
