import mongoose, { Schema, model } from "mongoose";
const CountryDetailSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    code: {
      type: String,
      required: [true, "Please tell us your code"],
    },
    continent: {
      type: String,
      required: [true, "Please tell us your continent"],
    },
    timeZone: {
      type: String,
      required: [true, "Please tell us your timeZone"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CountryModel = model("countries", CountryDetailSchema);

export default CountryModel;
