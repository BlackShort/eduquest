import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { authRouter } from './routes/auth-route.js';

export const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

const ALLOWED_ORIGINS = [
    process.env.CORS_ORIGIN,         
    'https://admin-codealpha.vercel.app',
    'http://localhost:5173',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use('/v1', authRouter);