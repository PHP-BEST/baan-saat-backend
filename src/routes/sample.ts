import express from "express";
import { getSample } from "../controllers/sample";

const sampleRouter = express.Router();

sampleRouter.get("/", getSample);

export default sampleRouter;
