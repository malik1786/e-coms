const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn('⚠️  MongoDB not available – running in IN-MEMORY mode (data resets on restart).');
    console.warn('   Start MongoDB or set MONGO_URI in backend/.env to persist data.');
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;

