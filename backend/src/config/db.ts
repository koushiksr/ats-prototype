import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {});
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// MongoDB connection event listeners
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

export default connectDB;
