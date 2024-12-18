import mongoose, { Schema, model } from "mongoose";

const AlbumDetailSchema = new Schema(
  {
    image: { type: String, required: [true, "Please tell us your image"] },
    type: { type: String, required: [true, "Please tell us your type"] },
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

const AlbumModel = model("album", AlbumDetailSchema);

export default AlbumModel;
