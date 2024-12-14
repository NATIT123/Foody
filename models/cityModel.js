import mongoose, { Schema, model } from "mongoose";

const CityDetailSchema = new Schema(
  {
    name: { type: String },
    selected: { type: Boolean, default: false },
    displayName: String,
    displayNameEn: String,
    countryName: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
    districts: { type: mongoose.Schema.Types.ObjectId, ref: "district" },
  },
  {
    timestamps: true,
  }
);

const CityModel = model("city", CityDetailSchema);

export default CityModel;
