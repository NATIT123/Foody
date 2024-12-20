import mongoose, { Schema, model } from "mongoose";

const CityDetailSchema = new Schema(
  {
    name: { type: String },
    selected: { type: Boolean, default: false },
    displayName: String,
    displayNameEn: String,
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "countries" },
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

const CityModel = model("cities", CityDetailSchema);

export default CityModel;
