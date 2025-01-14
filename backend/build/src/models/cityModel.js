import mongoose, { Schema, model } from "mongoose";
var CityDetailSchema = new Schema({
  name: {
    type: String
  },
  displayName: String,
  displayNameEn: String,
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "countries"
  },
  active: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
var CityModel = model("cities", CityDetailSchema);
export default CityModel;