import mongoose, { Schema, model } from "mongoose";
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
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model("categories", CategoryDetailSchema);

export default CategoryModel;
