import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import sampleRouter from './routes/sample';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import connectDB from './configs/mongodb';
import { allowedOrigins } from './configs/cors';

dotenv.config();
connectDB();

const app: Application = express();

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
  }),
);
app.use(hpp());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use('/samples', sampleRouter);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Baan Saat API',
      version: '1.0.0',
      description: 'API documentation for Baan Saat',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: `${process.env.NODE_ENV}: Connection Successful!`,
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Export the app for Vercel
export default app;

// Only listen when running locally
if (require.main === module) {
  app.listen(process.env.PORT, () =>
    console.log(
      `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
    ),
  );
}
