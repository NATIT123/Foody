import mongoose, { Schema, model } from "mongoose";

const AlbumDetailSchema = new Schema(
  {
    image: { type: String, required: [true, "Please tell us your image"] },
    type: { type: String, required: [true, "Please tell us your type"] },
    timeVideo: {
      type: String,
      required: [true, "Please tell us your timeVideo"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const AlbumModel = model("Albums", AlbumDetailSchema);

export default AlbumModel;
