import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './configs/db-config.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Code Service is running on port ${PORT}`);
        });
        // app.listen(PORT, "0.0.0.0", () => {
        //     console.log(`Code Service is running on port ${PORT}`);
        // });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();