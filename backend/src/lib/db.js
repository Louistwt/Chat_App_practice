import mongoose from "mongoose"; // using it to interact with MongoDB in a schema-based way

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};