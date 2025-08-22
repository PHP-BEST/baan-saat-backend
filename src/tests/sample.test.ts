// For testing sample.ts

import request from "supertest";
import express, { Application } from "express";
import sampleRouter from "../routes/sample";
import mongoose from "mongoose";

// Set up Express app for testing
const app: Application = express();
app.use(express.json());
app.use("/samples", sampleRouter);

beforeAll(async () => {
  const mongo_uri = process.env.MONGO_URI_TEST || "";
  await mongoose.connect(mongo_uri);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe("Sample API", () => {
  let firstSampleId: string;
  let firstName = "Test";
  let firstNewName = "Test 1";
  let firstDescription = "A test sample";
  let firstNewDescription = "A test sample 1";

  it("Add first sample", async () => {
    const res = await request(app)
      .post("/samples")
      .send({ name: firstName, description: firstDescription });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.name).toBe(firstName);
    expect(res.body.data.description).toBe(firstDescription);
    firstSampleId = res.body.data._id;
  });

  it("Add second sample", async () => {
    const name = "Test2";
    const description = "A test sample2";
    const res = await request(app)
      .post("/samples")
      .send({ name: name, description: description });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.name).toBe(name);
    expect(res.body.data.description).toBe(description);
  });

  it("Get 2 samples", async () => {
    const res = await request(app).get("/samples");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it("Get the first sample by id", async () => {
    const res = await request(app).get(`/samples/${firstSampleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", firstSampleId);
    expect(res.body.data.name).toBe(firstName);
    expect(res.body.data.description).toBe(firstDescription);
  });

  it("Update the first sample", async () => {
    const res = await request(app)
      .put(`/samples/${firstSampleId}`)
      .send({ name: firstNewName, description: firstNewDescription });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(firstNewName);
    expect(res.body.data.description).toBe(firstNewDescription);
  });

  it("Delete the first sample", async () => {
    const res = await request(app).delete(`/samples/${firstSampleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(firstNewName);
    expect(res.body.data.description).toBe(firstNewDescription);
  });

  it("Return 404 for non-existent path", async () => {
    const res = await request(app).get(`/samples/0123`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
