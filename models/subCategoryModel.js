import mongoose, { Schema, model } from "mongoose";
const SubCategoryDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your image"] },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  },
  {
    timestamps: true,
  }
);

const SubCategoryModel = model("subcategories", SubCategoryDetailSchema);

export default SubCategoryModel;
