import mongoose, { Schema, model } from "mongoose";

const CommentDetailSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    time: { type: String, required: [true, "Please tell us your time"] },
    rate: { type: Number, required: [true, "Please tell us your rate"] },
    title: { type: String, required: [true, "Please tell us your title"] },
    description: {
      type: String,
      required: [true, "Please tell us your description"],
    },
    type: { type: String, required: [true, "Please tell us your type"] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurants" },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("comments", CommentDetailSchema);

export default CommentModel;
