import express from "express";
import { getSample } from "../controllers/sample";

const sampleRouter = express.Router();

/**
 * @openapi
 * /sample:
 *   get:
 *     summary: Sample GET
 *     responses:
 *       200:
 *         description: Returns a sample GET response
 */
sampleRouter.get("/", getSample);

export default sampleRouter;
