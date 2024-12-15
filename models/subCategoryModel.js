import mongoose, { Schema, model } from "mongoose";

const SubCategoryDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your image"] },
    type: { type: String, required: [true, "Please tell us your type"] },
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
