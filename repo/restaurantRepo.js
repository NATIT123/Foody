import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

import ObjectId from "mongoose";

import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";

class RestaurantRepository {
  constructor(restaurantModel, countryModel) {
    this.restaurantModel = restaurantModel;
    this.countryModel = countryModel;
  }

  addRestaurant() {
    return createOne(this.restaurantModel);
  }

  getAllRestaurants() {
    return getAll(this.restaurantModel);
  }

  getRestaurantById() {
    return getOne(this.restaurantModel, "districtId");
  }

  updateRestaurantById() {
    return updateOne(this.restaurantModel);
  }

  deleteRestaurantById() {
    return deleteOne(this.restaurantModel);
  }

  getByCity() {
    return catchAsync(async (req, res, next) => {
      const cityId = req.params.cityId;
      // if (cityId) filter = { cityId: cityId };
      if (!cityId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }
      const features = new APIFeatures(this.restaurantModel.find(), req.query)
        .sort()
        .limitFields()
        .paginate()
        .populate();
      const doc = await features.query;

      const results = doc.filter((item) => {
        return item.districtId?.cityId.toString() === cityId;
      });

      // SEND RESPONSE
      if (!doc) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }
      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        page: req.query.page * 1 || 1,
        results: results.length,
        data: {
          data: results,
        },
      });
    });
  }
}
export default RestaurantRepository;
