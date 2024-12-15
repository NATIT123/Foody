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
    title: { type: String, required: [true, "Please tell us your title"] },
    description: {
      type: String,
      required: [true, "Please tell us your description"],
    },
    type: { type: String, required: [true, "Please tell us your type"] },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("comment", CommentDetailSchema);

export default CommentModel;
