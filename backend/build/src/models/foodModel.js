import mongoose, { Schema, model } from "mongoose";
var FoodDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"]
  },
  image: {
    type: String,
    required: [true, "Please tell us your image"]
  },
  priceOriginal: {
    type: String,
    required: [true, "Please tell us your priceOriginal"]
  },
  priceDiscount: {
    type: String,
    required: [true, "Please tell us your priceDiscount"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants"
  }
}, {
  timestamps: true
});
var FoodModel = model("foods", FoodDetailSchema);
export default FoodModel;