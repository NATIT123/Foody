import mongoose, { Schema, model } from "mongoose";
import fs from "fs";
import { importData } from "../controllers/handleFactory.js";
const CategoryDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    description: {
      type: String,
      required: [true, "Please tell us your description"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model("category", CategoryDetailSchema);

export default CategoryModel;
