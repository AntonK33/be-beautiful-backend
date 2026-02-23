import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import apiRouter from "./routers/apiRouter.js";
//import { getEnvVar } from "./utils/getEnvVar.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { swaggerConfig } from './middlewares/swaggerConfig.js';
// import NovaPoshta from "novaposhta";

dotenv.config();

export async function setupServer() {
  const PORT = Number(process.env.PORT) || 3000;

  const app = express();

  const swagger = await swaggerConfig();

  app.use('/api-docs', ...swagger);
  // const allowedOrigins = [
  //   'http://localhost:3000',
  //   'http://localhost:5173',
  //   'https://code-guard-frontend.vercel.app',
  // ];

  // app.use(
  //   cors({
  //     origin: (origin, callback) => {
  //       if (!origin || allowedOrigins.includes(origin)) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error('Not allowed by CORS'));
  //       }
  //     },
  //     credentials: true,
  //   }),
  // );
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );
  app.get("/", (req, res) => {
    res.send("✅ Backend is running");
  });
  // const np = new NovaPoshta({ apiKey: process.env.NOVAPOSHTA_KEY });
  // app.get("/api/np/cities", async (req, res) => {
  //   try {
  //     const data = await np.address.getCities();
  //     res.json(data);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message || "Ошибка API" });
  //   }
  // });
  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}
