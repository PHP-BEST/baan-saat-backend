import dotenv from "dotenv";
import express, { Application } from "express";
import sampleRouter from "./routes/sample";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use("/sample", sampleRouter);

const port = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV || "development";

app.listen(port, () =>
  console.log(`Server started on port ${port} in ${node_env} mode`)
);
