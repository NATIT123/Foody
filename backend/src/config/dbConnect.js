import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
///Enviroment Variables
console.log(path.resolve(__dirname, "./config.env"));
dotenv.config({ path: path.resolve(__dirname, "../config.env") });
const mongoUrl =
  process.env.URL.replace("<PASSWORD>", process.env.PASSWORD_MONGODB) ||
  process.env.LOCAL_URL;
const connectDb = async () => {
  try {
    await mongoose.connect(mongoUrl, {});
    console.log("Connect Db");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
