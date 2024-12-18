import mongoose, { Schema, model } from "mongoose";

const FoodDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    image: { type: String, required: [true, "Please tell us your image"] },
    priceOriginal: {
      type: String,
      required: [true, "Please tell us your priceOriginal"],
    },
    priceDiscount: {
      type: String,
      required: [true, "Please tell us your priceDiscount"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  },
  {
    timestamps: true,
  }
);

const FoodModel = model("food", FoodDetailSchema);

export default FoodModel;
