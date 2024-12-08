import mongoose, { Schema, model } from "mongoose";

const FoodDetailSchema = new Schema(
  {
    name: String,
    price: Number,
    image: String,
    amount: String,
  },
  {
    timestamps: true,
  }
);

const FoodModel = model("Foods", FoodDetailSchema);

export default FoodModel;
