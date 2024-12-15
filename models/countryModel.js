import mongoose, { Schema, model } from "mongoose";
import fs from "fs";
import { importData } from "../controllers/handleFactory.js";
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
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const CountryModel = model("country", CountryDetailSchema);

// Load JSON and add timestamps
const countries = JSON.parse(
  fs.readFileSync("./data/country.json", "utf8")
).map((country) => ({
  ...country,
}));

importData(CountryModel, countries, mongoose);

export default CountryModel;
