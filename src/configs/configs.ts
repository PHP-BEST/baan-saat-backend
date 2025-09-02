import dotenv from "dotenv"

dotenv.config()

export const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

export const serverUrl = process.env.SERVER_URL || "http://localhost:3000";

export const mongoUri = process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD || ""
    : process.env.MONGO_URI_DEV || "";