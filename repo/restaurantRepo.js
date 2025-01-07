import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import mongoose from "mongoose";

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

  getByOptions() {
    return catchAsync(async (req, res, next) => {
      const cityId = req.params.cityId;
      const categoryId = req.params.categoryId;
      if (
        !cityId.match(/^[0-9a-fA-F]{24}$/) ||
        !categoryId.match(/^[0-9a-fA-F]{24}$/)
      ) {
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
        .populate()
        .paginate();
      const doc = await features.query;
      console.log(doc.length);

      // const results = doc.filter((item) => {
      //   return (
      //     item.districtId?.cityId.toString() === cityId &&
      //     item.subCategoryId?.categoryId.toString() === categoryId
      //   );
      // });

      // const test = doc.filter((item) => {
      //   const itemReplace = item.cuisines.split(",").map((item) => {
      //     return item.replace(/ /g, "");
      //   });

      //   return itemReplace.includes("MónViệt");
      // });
      // console.log(test);
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
        results: doc.length,
        data: {
          data: results,
        },
      });
    });
  }

  getByCity() {
    return catchAsync(async (req, res, next) => {
      const cityId = req.params.cityId;
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
        .populate();
      const doc = await features.query;

      console.log(doc);

      let results = doc.filter((item) => {
        return item.districtId?.cityId.toString() === cityId;
      });

      const page = req.query.page * 1 || 1;
      const limit = 100;
      const skip = (page - 1) * limit;

      results = results.slice(skip, skip + limit);
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

  getTopDeals() {
    return catchAsync(async (req, res, next) => {
      const cityId = req.params.cityId;

      // Kiểm tra tính hợp lệ của cityId
      if (!cityId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }

      // Tạo query với aggregation
      const features = new APIFeatures(
        this.restaurantModel.aggregate([
          {
            $addFields: {
              averageSales: {
                $avg: [
                  "$qualityRate",
                  "$serviceRate",
                  "$locationRate",
                  "$priceRate",
                  "$serviceRate",
                ],
              },
            },
          },
          {
            $lookup: {
              from: "districts", // Tên collection district
              localField: "districtId", // Trường trong collection restaurant
              foreignField: "_id", // Trường trong collection district
              as: "district", // Kết quả join sẽ có trường "district"
            },
          },
          {
            $lookup: {
              from: "subcategories", // Tên collection subcategory
              localField: "subCategoryId", // Trường trong collection restaurant
              foreignField: "_id", // Trường trong collection subcategory
              as: "subcategory", // Kết quả join sẽ có trường "subcategory"
            },
          },
          {
            $sort: { averageSales: -1, createdAt: -1 }, // Sắp xếp theo averageSales và createdAt
          },
          {
            $match: { "district.cityId": new mongoose.Types.ObjectId(cityId) },
          },
          {
            $limit: parseInt(req.query.limit) || 5, // Lấy 5 bản ghi đầu tiên
          },
        ]),
        req.query
      ).limitFields();

      // Thực hiện truy vấn
      const doc = await features.query;

      if (!doc || doc.length === 0) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }

      // Gửi phản hồi
      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        results: doc.length,
        data: {
          data: doc,
        },
      });
    });
  }

  getRestaurantByFields() {
    return catchAsync(async (req, res, next) => {
      const cityId = req.params.cityId;
      const search = req.query.search || "";
      console.log(search);
      // Kiểm tra tính hợp lệ của cityId
      if (!cityId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }

      // Tạo query với aggregation
      const features = new APIFeatures(
        this.restaurantModel.aggregate([
          {
            $addFields: {
              averageSales: {
                $avg: [
                  "$qualityRate",
                  "$serviceRate",
                  "$locationRate",
                  "$priceRate",
                  "$serviceRate",
                ],
              },
            },
          },
          {
            $lookup: {
              from: "districts", // Tên collection district
              localField: "districtId", // Trường trong collection restaurant
              foreignField: "_id", // Trường trong collection district
              as: "district", // Kết quả join sẽ có trường "district"
            },
          },
          {
            $lookup: {
              from: "subcategories", // Tên collection subcategory
              localField: "subCategoryId", // Trường trong collection restaurant
              foreignField: "_id", // Trường trong collection subcategory
              as: "subcategory", // Kết quả join sẽ có trường "subcategory"
            },
          },
          {
            $sort: { averageSales: -1, createdAt: -1 }, // Sắp xếp theo averageSales và createdAt
          },
          {
            $match: { "district.cityId": new mongoose.Types.ObjectId(cityId) },
          },

          {
            $limit: 10, // Lấy 10 bản ghi đầu tiên
          },
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: "i" } },
                {
                  address: { $regex: search, $options: "i" },
                },
                {
                  cuisines: { $regex: search, $options: "i" },
                },
              ],
            },
          },
        ]),
        req.query
      ).limitFields();

      // Thực hiện truy vấn
      const doc = await features.query;

      if (!doc || doc.length === 0) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }

      // Gửi phản hồi
      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        results: doc.length,
        data: {
          data: doc,
        },
      });
    });
  }
}
export default RestaurantRepository;
