import mongoose, { Schema, model } from "mongoose";
import { type } from "node:os";

const RestaurantDetailSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
      unique: true,
    },
    numberView: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "pending",
    },
    image: { type: String, required: [true, "Please tell us your image"] },
    address: { type: String, required: [true, "Please tell us your address"] },
    active: {
      type: Boolean,
      default: true,
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "districts" },
    coordinateId: { type: mongoose.Schema.Types.ObjectId, ref: "coordinates" },
    cuisinesId: { type: mongoose.Schema.Types.ObjectId, ref: "cuisines" },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
    },
    cuisines: { type: String },
    audiences: {
      type: String,
    },
    qualityRate: {
      type: Number,
      required: [true, "Please tell us your qualityRate"],
    },
    serviceRate: {
      type: Number,
      required: [true, "Please tell us your serviceRate"],
    },
    locationRate: {
      type: Number,
      required: [true, "Please tell us your locationRate"],
    },
    priceRate: {
      type: Number,
      required: [true, "Please tell us your priceRate"],
    },
    spaceRate: {
      type: Number,
      required: [true, "Please tell us your spaceRate"],
    },
    timeOpen: {
      type: String,
      required: [true, "Please tell us your timeOpen"],
    },
    priceRange: {
      type: String,
      required: [true, "Please tell us your priceRange"],
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantModel = model("restaurants", RestaurantDetailSchema);

export default RestaurantModel;
