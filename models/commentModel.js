import mongoose, { Schema, model } from "mongoose";

const CommentDetailSchema = new Schema(
  {
    userImage: {
      type: String,
      required: [true, "Please tell us your userImage"],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    userName: {
      type: String,
      required: [true, "Please tell us your userName"],
    },
    time: { type: String, required: [true, "Please tell us your time"] },
    rate: { type: Number, required: [true, "Please tell us your rate"] },
    description: {
      type: String,
      required: [true, "Please tell us your description"],
    },
    type: { type: String, required: [true, "Please tell us your type"] },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("Comments", CommentDetailSchema);

export default CommentModel;
