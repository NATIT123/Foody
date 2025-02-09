import mongoose, { Schema, model } from "mongoose";

const CoordinateDetailSchema = new Schema(
  {
    address: {
      type: String,
      required: [true, "Please tell us your address"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    longitude: {
      type: Number,
      required: [true, "Please tell us your longitude"],
    },
    latitude: {
      type: Number,
      required: [true, "Please tell us your latitude"],
    },
    iframe: { type: String, required: [true, "Please tell us your iframe"] },
  },
  {
    timestamps: true,
  }
);

const CoordinateModel = model("coordinates", CoordinateDetailSchema);

export default CoordinateModel;
