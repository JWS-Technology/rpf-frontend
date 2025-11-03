import mongoose from "mongoose";

interface ConnectionStates {
  isConnected?: number;
}

const connectionStates: ConnectionStates = {};

export async function connect(): Promise<void> {
  if (connectionStates.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);

    connectionStates.isConnected = db.connection.readyState;
    // console.log("✅ Database connected:", db.connection.host);
  } catch (error) {
    console.error("❌ Error in database connection\n", error);
    process.exit(1);
  }
}