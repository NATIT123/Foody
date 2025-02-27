import mongoose, { Schema, model } from "mongoose";
import { type } from "node:os";
var RestaurantDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    unique: true
  },
  numberView: {
    type: Number,
    "default": 0
  },
  status: {
    type: String,
    "default": "pending"
  },
  image: {
    type: String,
    required: [true, "Please tell us your image"]
  },
  address: {
    type: String,
    required: [true, "Please tell us your address"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "districts"
  },
  coordinateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coordinates"
  },
  cuisinesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cuisines"
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategories"
  },
  cuisines: {
    type: String
  },
  audiences: {
    type: String
  },
  qualityRate: {
    "default": 0,
    type: Number
  },
  serviceRate: {
    "default": 0,
    type: Number
  },
  locationRate: {
    "default": 0,
    type: Number
  },
  priceRate: {
    "default": 0,
    type: Number
  },
  spaceRate: {
    "default": 0,
    type: Number
  },
  timeOpen: {
    type: String
  },
  priceRange: {
    type: String
  },
  averageScore: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
});
var RestaurantModel = model("restaurants", RestaurantDetailSchema);
export default RestaurantModel;