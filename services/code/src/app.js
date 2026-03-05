
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import submissionRoutes from './routes/submission.routes.js';

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.json({ message: 'Code Evaluation Service running' });
});

// Routes
app.use('/v1/submissions', submissionRoutes);

export default app;
