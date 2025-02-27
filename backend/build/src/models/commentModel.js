import mongoose, { Schema, model } from "mongoose";
var CommentDetailSchema = new Schema({
  active: {
    type: Boolean,
    "default": true
  },
  numberOfLikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }],
  time: {
    type: String,
    required: [true, "Please tell us your time"]
  },
  rate: {
    type: Number,
    required: [true, "Please tell us your rate"]
  },
  title: {
    type: String,
    required: [true, "Please tell us your title"]
  },
  description: {
    type: String,
    required: [true, "Please tell us your description"]
  },
  type: {
    type: String,
    "default": "via Web"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    index: true
  }
}, {
  timestamps: true
});
var CommentModel = model("comments", CommentDetailSchema);
export default CommentModel;