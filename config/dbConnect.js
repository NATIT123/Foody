import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoUrl = process.env.mongoUrl || "";
const connectDb = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connect Db");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
