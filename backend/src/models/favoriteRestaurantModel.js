import mongoose, { Schema, model } from "mongoose";

const FavoriteRestaurantDetailSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurants" },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FavoriteRestaurantModel = model(
  "favoriteRestaurants",
  FavoriteRestaurantDetailSchema
);

export default FavoriteRestaurantModel;
