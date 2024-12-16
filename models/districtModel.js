import mongoose, { Schema, model } from "mongoose";
import fs from "fs";
import { importData } from "../controllers/handleFactory.js";
const DistrictDetailSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "city" },
  },
  {
    timestamps: true,
  }
);

const DistrictModel = model("district", DistrictDetailSchema);

export default DistrictModel;
