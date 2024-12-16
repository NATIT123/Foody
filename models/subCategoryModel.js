import mongoose, { Schema, model } from "mongoose";
import fs from "fs";
import { importData } from "../controllers/handleFactory.js";
const SubCategoryDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your image"] },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  },
  {
    timestamps: true,
  }
);

const SubCategoryModel = model("subCategory", SubCategoryDetailSchema);

export default SubCategoryModel;
