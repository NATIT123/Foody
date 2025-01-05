import mongoose, { Schema, model } from "mongoose";

const CityDetailSchema = new Schema(
  {
    name: { type: String },

    displayName: String,
    displayNameEn: String,
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "countries" },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CityModel = model("cities", CityDetailSchema);

export default CityModel;
