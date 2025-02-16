import mongoose, { Schema, model } from "mongoose";

const AlbumDetailSchema = new Schema(
  {
    image: { type: String, required: [true, "Please tell us your image"] },
    type: { type: String, required: [true, "Please tell us your type"] },
    active: {
      type: Boolean,
      default: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurants",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const AlbumModel = model("albums", AlbumDetailSchema);

export default AlbumModel;
