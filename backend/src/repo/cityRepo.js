import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
class CityRepository {
  constructor(cityModel) {
    this.cityModel = cityModel;
  }

  addCity() {
    return createOne(this.cityModel);
  }

  getAll() {
    return catchAsync(async (req, res, next) => {
      try {
        const cities = await this.cityModel.aggregate([
          {
            $match: {
              countryId: new mongoose.Types.ObjectId(
                "675e78747e954370b5142b0e"
              ),
            },
          },
        ]);

        res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: cities.length,
          data: {
            data: cities,
          },
        });
      } catch (error) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }
    });
  }

  getCityById() {
    return getOne(this.cityModel, "CountryId");
  }

  updateCityById() {
    return updateOne(this.cityModel);
  }

  deleteCityById() {
    return deleteOne(this.cityModel);
  }
}
export default CityRepository;
