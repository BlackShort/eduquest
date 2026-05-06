import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { submissionRoutes } from './routes/submission-routes.js';

export const app = express();

if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-student-id']
    }));
}

app.use(express.json());
app.use(morgan('dev'));

app.use('/v1/submissions', submissionRoutes);