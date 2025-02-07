import mongoose, { Schema, model } from "mongoose";
const CuisinesDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    active: {
      type: Boolean,
      default: true,
    },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurants" },
  },
  {
    timestamps: true,
  }
);

const CuisinesModel = model("cuisines", CuisinesDetailSchema);

export default CuisinesModel;
