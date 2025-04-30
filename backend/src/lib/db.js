import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionString = process.env.MONGO_URI.replace(
            "<MONGODB_PASSWORD_PLACEHOLDER>",
            process.env.MONGODB_PASSWORD
        );

        const conn = await mongoose.connect(connectionString);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in connecting to MongoDB", error);
        process.exit(1); // 1 means faliure. We really need to crash our application. Node app is in unclean state during this time.
    }
};
