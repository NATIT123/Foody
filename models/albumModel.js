import mongoose, { Schema, model } from "mongoose";

const AlbumDetailSchema = new Schema(
  {
    image: String,
    type: String,
    timeVideo: String,
  },
  {
    timestamps: true,
  }
);

const AlbumModel = model("Albums", AlbumDetailSchema);

export default AlbumModel;
