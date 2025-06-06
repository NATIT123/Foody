import mongoose, { Schema, model } from "mongoose";
var CoordinateDetailSchema = new Schema({
  address: {
    type: String,
    required: [true, "Please tell us your address"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  location: {
    type: {
      type: String,
      "enum": ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  iframe: {
    type: String,
    required: [true, "Please tell us your iframe"]
  }
}, {
  timestamps: true
});
CoordinateDetailSchema.index({
  location: "2dsphere"
});
var CoordinateModel = model("coordinates", CoordinateDetailSchema);
export default CoordinateModel;