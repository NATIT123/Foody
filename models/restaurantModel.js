import mongoose, { Schema, model } from "mongoose";

const RestaurantDetailSchema = new Schema(
  {
    name: { type: String, required: [true, "Please tell us your name"] },
    image: String,
    address: { type: String, required: [true, "Please tell us your address"] },
    location: {
      type: String,
      required: [true, "Please tell us your location"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    district: {
      type: String,
      required: [true, "Please tell us your district"],
    },
    area: { type: String, required: [true, "Please tell us your area"] },
    category: {
      type: String,
      required: [true, "Please tell us your category"],
    },
    cusines: { type: String, required: [true, "Please tell us your cusines"] },
    audiences: {
      type: String,
      required: [true, "Please tell us your audiences"],
    },
    qualityRate: {
      type: Number,
      required: [true, "Please tell us your qualityRate"],
    },
    serviceRate: {
      type: Number,
      required: [true, "Please tell us your serviceRate"],
    },
    postionRate: {
      type: Number,
      required: [true, "Please tell us your positionRate"],
    },
    priceRate: {
      type: Number,
      required: [true, "Please tell us your priceRate"],
    },
    spaceRate: {
      type: Number,
      required: [true, "Please tell us your spaceRate"],
    },
    timeOpen: {
      type: Number,
      required: [true, "Please tell us your timeOpen"],
    },
    priceRange: {
      type: Number,
      required: [true, "Please tell us your priceRange"],
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantModel = model("Restaurants", RestaurantDetailSchema);

export default RestaurantModel;
