// For testing sample.ts

import request from "supertest";
import express, { Application } from "express";
import sampleRouter from "../routes/sample";

const app: Application = express();
app.use(express.json());
app.use("/sample", sampleRouter);

describe("GET /sample", () => {
  it("should return a success message", async () => {
    const res = await request(app).get("/sample");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Test successful");
  });
});
