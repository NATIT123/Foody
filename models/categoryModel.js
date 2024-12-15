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

// Load JSON and add timestamps
const category = JSON.parse(
  fs.readFileSync("./data/category.json", "utf8")
).map((category) => ({
  ...category,
}));

importData(CategoryModel, category, mongoose);

export default CategoryModel;
