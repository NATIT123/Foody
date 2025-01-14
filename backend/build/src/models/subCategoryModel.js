import mongoose, { Schema, model } from "mongoose";
var SubCategoryDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your image"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories"
  }
}, {
  timestamps: true
});
var SubCategoryModel = model("subcategories", SubCategoryDetailSchema);
export default SubCategoryModel;