const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'NOT SET');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // Increased timeout for initial connection
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        
        if (error.message.includes('ENOTFOUND')) {
            console.error('DNS Resolution Error - Possible causes:');
            console.error('1. MongoDB cluster is paused or deleted');
            console.error('2. Connection string hostname has changed');
            console.error('3. Network connectivity issues');
            console.error('4. Firewall blocking the connection');
        }
        
        console.error('Full error:', error);
        process.exit(1);
    }
}
