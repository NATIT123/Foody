import mongoose, { Schema, model } from "mongoose";

const FoodDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    price: { type: String, required: [true, "Please tell us your price"] },
    image: { type: String, required: [true, "Please tell us your image"] },
    amount: { type: String, required: [true, "Please tell us your amount"] },
  },
  {
    timestamps: true,
  }
);

const FoodModel = model("Foods", FoodDetailSchema);

export default FoodModel;
