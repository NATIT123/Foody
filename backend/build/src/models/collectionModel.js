import mongoose, { Schema, model } from "mongoose";
var CollectionDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your image"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  isPublic: {
    type: Boolean,
    "default": false
  },
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants"
  }
}, {
  timestamps: true
});
var CollectionModel = model("Collections", CollectionDetailSchema);
export default CollectionModel;