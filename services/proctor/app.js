import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import { proctorRoutes } from './routes/proctor.routes.js';
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get("/health", (req, res) => {
    res.json({ service: "proctor-service", status: "ok" });
});

app.use('/v1', proctorRoutes);
app.use(errorHandler);
