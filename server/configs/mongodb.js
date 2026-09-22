import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async () => {

    if (mongoose.connection.readyState >= 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    mongoose.connection.on('connected', () => console.log('Database Connected'))

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "lms"
    })

}

export default connectDB