
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { submissionRoutes } from './routes/submission-routes.js';

export const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/v1/submissions', submissionRoutes);