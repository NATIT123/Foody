import mongoose, { Schema, model } from "mongoose";
import { importData } from "../controllers/handleFactory.js";
import fs from "fs";

const CityDetailSchema = new Schema(
  {
    name: { type: String },
    selected: { type: Boolean, default: false },
    displayName: String,
    displayNameEn: String,
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
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

const CityModel = model("city", CityDetailSchema);

export default CityModel;
