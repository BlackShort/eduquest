
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const submissionRoutes = require('./routes/submission.routes');

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
app.use('/api/v1/submissions', submissionRoutes);

module.exports = app;
