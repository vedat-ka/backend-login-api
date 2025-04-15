import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://192.168.0.4:27017/?readPreference=primary&directConnection=true&ssl=false';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB verbunden');
  } catch (error) {
    console.error('MongoDB Verbindung fehlgeschlagen:', error);
    throw error;
  }
};