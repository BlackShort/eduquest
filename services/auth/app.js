import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { authRouter } from './routes/auth-route.js';

export const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/api/v1/auth', authRouter);