import mongoose, { Schema, model } from "mongoose";

const DistrictDetailSchema = new Schema(
  {
    district: [
      {
        name: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DistrictModel = model("district", DistrictDetailSchema);

export default DistrictModel;
