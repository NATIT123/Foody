import mongoose, { Schema, model } from "mongoose";

const CommentDetailSchema = new Schema(
  {
    userImage: String,
    userName: String,
    time: String,
    rate: Number,
    description: String,
    type: String,
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("Comments", CommentDetailSchema);

export default CommentModel;
