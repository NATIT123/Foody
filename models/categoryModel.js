import mongoose, { Schema, model } from "mongoose";

const CategoryDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    description: { type: String, required: [true, "Please tell us your type"] },
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
