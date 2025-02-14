import mongoose, { Schema, model } from "mongoose";

const NotificationDetailSchema = new Schema(
  {
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
    isRead: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationModel = model("notifications", NotificationDetailSchema);

export default NotificationModel;
