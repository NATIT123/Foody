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

// Load JSON and add timestamps
const district = JSON.parse(
  fs.readFileSync("./data/district.json", "utf8")
).map((district) => ({
  ...district,
}));

importData(DistrictModel, district, mongoose);

export default DistrictModel;
