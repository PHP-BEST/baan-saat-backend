import dotenv from "dotenv"

dotenv.config()

const clientUrl = "http://localhost:5173";

let mongoUri: string = "";

if (process.env.NODE_ENV === "production") {
    mongoUri = process.env.MONGO_URI_PROD || "";
} 
else {
    mongoUri = process.env.MONGO_URI_DEV || "";
}

if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not defined");
}

export { clientUrl, mongoUri };