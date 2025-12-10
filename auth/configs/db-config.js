import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "auth_db",
            maxPoolSize: 10,           // Maximum number of connections in the pool
            minPoolSize: 2,            // Minimum number of connections in the pool
            socketTimeoutMS: 45000,    // Socket timeout for operations
            serverSelectionTimeoutMS: 5000,  // Timeout for server selection
            maxIdleTimeMS: 60000,      // Max time a connection can be idle
            retryWrites: true,         // Enable automatic retry for writes
            w: "majority",             // Write concern - wait for majority
            journal: true,             // Enable journaling
            waitQueueTimeoutMS: 10000, // Time to wait for an available connection
        });
        console.log('Connected to edqdb-auth-server successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};