import mongoose, { Schema, model } from "mongoose";
var CategoryDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"]
  },
  description: {
    type: String,
    required: [true, "Please tell us your description"]
  },
  active: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
var CategoryModel = model("categories", CategoryDetailSchema);
export default CategoryModel;