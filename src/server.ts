import dotenv from "dotenv";
import express, { Application } from "express";
import sampleRouter from "./routes/sample";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use("/sample", sampleRouter);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Baan Saat API",
      version: "1.0.0",
      description: "API documentation for Project Baan Saat",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV || "development";

app.listen(port, () =>
  console.log(`Server started on port ${port} in ${node_env} mode`)
);
