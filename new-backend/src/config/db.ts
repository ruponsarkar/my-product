import mongoose from 'mongoose';

export default async function connectDB(uri = process.env.MONGO_URI!) {
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri, {
    // recommended options are default in newer mongoose versions
  });
  console.log('MongoDB connected');
}
