import mongoose, { Schema, model } from "mongoose";

const CityDetailSchema = new Schema(
  {
    name: { type: String },
    selected: { type: Boolean, default: false },
    displayName: String,
    displayNameEn: String,
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
  },
  {
    timestamps: true,
  }
);

const CityModel = model("city", CityDetailSchema);

export default CityModel;
