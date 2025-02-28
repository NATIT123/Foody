import mongoose, { Schema, model } from "mongoose";

const ReplySchema = new Schema(
  {
    user: {
      fullname: { type: String, required: true },
      photo: { type: String, required: true },
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Không cần tạo _id cho từng reply nhỏ
);

const CommentDetailSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    numberOfLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    time: { type: String, required: [true, "Please tell us your time"] },
    rate: { type: Number, required: [true, "Please tell us your rate"] },
    title: { type: String, required: [true, "Please tell us your title"] },
    description: {
      type: String,
      required: [true, "Please tell us your description"],
    },
    type: {
      type: String,
      default: "via Web",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", index: true },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurants",
      index: true,
    },
    replies: [ReplySchema],
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("comments", CommentDetailSchema);

export default CommentModel;
