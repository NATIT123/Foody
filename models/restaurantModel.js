import mongoose, { Schema, model } from "mongoose";

const RestaurantDetailSchema = new Schema(
  {
    name: String,
    image: String,
    address: String,
    location: String,
    district: String,
    area: String,
    category: String,
    cusines: String,
    audiences: String,
    qualityRate: Number,
    serviceRate: Number,
    postionRate: Number,
    priceRate: Number,
    spaceRate: Number,
    timeOpen: String,
    priceRange: String,
  },
  {
    timestamps: true,
  }
);

const RestaurantModel = model("Restaurants", RestaurantDetailSchema);

export default RestaurantModel;
