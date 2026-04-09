import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { authRouter } from './routes/auth-route.js';

export const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
<<<<<<< Updated upstream
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // removed the hardcoded origin : https://www.codealpha.app
=======
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    // origin: 'http://localhost:5173',
>>>>>>> Stashed changes
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/v1', authRouter);