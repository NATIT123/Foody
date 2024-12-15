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
      select: false,
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "city" },
  },
  {
    timestamps: true,
  }
);

const DistrictModel = model("district", DistrictDetailSchema);

export default DistrictModel;
