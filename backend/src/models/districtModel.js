import mongoose, { Schema, model } from "mongoose";
const DistrictDetailSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
  },
  {
    timestamps: true,
  }
);

const DistrictModel = model("districts", DistrictDetailSchema);

export default DistrictModel;
