import mongoose, { Schema, model } from "mongoose";

const FoodDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    price: { type: String, required: [true, "Please tell us your price"] },
    image: { type: String, required: [true, "Please tell us your image"] },
    amount: { type: Number, required: [true, "Please tell us your amount"] },
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
