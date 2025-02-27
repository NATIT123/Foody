import mongoose, { Schema, model } from "mongoose";
var AlbumDetailSchema = new Schema({
  image: {
    type: String,
    required: [true, "Please tell us your image"]
  },
  type: {
    type: String,
    "default": "image"
  },
  active: {
    type: Boolean,
    "default": true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: true
  }
}, {
  timestamps: true
});
var AlbumModel = model("albums", AlbumDetailSchema);
export default AlbumModel;