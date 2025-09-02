import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import passport from "passport"
import session from "express-session"
import MongoStore from "connect-mongo";
import { CipherKey } from "crypto";

import mongoose from "mongoose";
import { mongoUri } from "./configs/configs";

import initializePassport from "./auth/initializePassport";

import authRoutes from "./auth/authRoutes";

dotenv.config();

const app: Application = express();

(async() => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
})()

app.use(cors());

const store = MongoStore.create({
  mongoUrl: mongoUri,
  collectionName: "sessions",
  ttl: 14 * 24 * 60 * 60 // Session TTL in seconds (14 days)
});

app.use(session({
  secret: process.env.SESSION_SECRET as CipherKey,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    // Cookie expiration in milliseconds (e.g., 7 days)
    maxAge: 1000 * 60 * 60 * 24 * 7 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport)

app.use("/", authRoutes);

app.use(express.json()); 

app.listen(
  process.env.PORT,
  () => console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  )
);
