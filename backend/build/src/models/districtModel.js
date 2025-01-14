import mongoose, { Schema, model } from "mongoose";
var DistrictDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cities"
  }
}, {
  timestamps: true
});
var DistrictModel = model("districts", DistrictDetailSchema);
export default DistrictModel;