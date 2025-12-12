
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "code_db",
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            maxIdleTimeMS: 60000,
            retryWrites: true,
            w: "majority",
            journal: true,
            waitQueueTimeoutMS: 10000
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // stop app if DB fails
    }
};

module.exports = connectDB;
