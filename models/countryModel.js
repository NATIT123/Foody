import mongoose, { Schema, model } from "mongoose";

const CountryDetailSchema = new Schema(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

const CountryModel = model("country", CountryDetailSchema);

export default CountryModel;
