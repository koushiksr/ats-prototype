import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config();
const port = process.env.PORT || 3000;
// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error("Error: MongoDB URI not defined in environment variables");
  process.exit(1);
}
// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
