import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import mongoose from "mongoose";
import fetch from "node-fetch";
// Import the required modules and clients
import { GetRecommendationsCommand } from "@aws-sdk/client-personalize-runtime";
import { personalizeRuntimeClient } from "../libs/personalizeClients.js"; // Ensure this is correctly implemented
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";

class RestaurantRepository {
  constructor(restaurantModel, coordinateModel) {
    this.restaurantModel = restaurantModel;
    this.coordinateModel = coordinateModel;
  }

  addRestaurant() {
    return createOne(this.restaurantModel);
  }

  getAllRestaurants() {
    return catchAsync(async (req, res, next) => {
      try {
        const {
          subCategory,
          cuisines,
          district,
          selectedCity,
          selectedCategory,
        } = req.body;
        const page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
        const limit = Math.max(req.query?.limit * 1 || 100, 1); // Ensure limit is a positive integer
        const skip = (page - 1) * limit;
        let matchConditions = {};

        // Apply match conditions based on incoming filters
        if (mongoose.Types.ObjectId.isValid(subCategory)) {
          matchConditions["subCategoryId"] = new mongoose.Types.ObjectId(
            subCategory
          );
        }
        if (mongoose.Types.ObjectId.isValid(district)) {
          matchConditions["districtId"] = new mongoose.Types.ObjectId(district);
        }
        if (mongoose.Types.ObjectId.isValid(cuisines)) {
          matchConditions["cuisinesId"] = new mongoose.Types.ObjectId(cuisines);
        }
        if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
          matchConditions["subCategoryDetails.categoryId"] =
            new mongoose.Types.ObjectId(selectedCategory);
        }

        if (mongoose.Types.ObjectId.isValid(selectedCity)) {
          matchConditions["districtDetails.cityId"] =
            new mongoose.Types.ObjectId(selectedCity);
        }

        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: { active: true },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $lookup: {
              from: "subcategories",
              localField: "subCategoryId",
              foreignField: "_id",
              as: "subCategoryDetails",
            },
          },
          {
            $lookup: {
              from: "districts",
              localField: "districtId",
              foreignField: "_id",
              as: "districtDetails",
            },
          },
          {
            $lookup: {
              from: "comments",
              let: { restaurantId: { $toObjectId: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$restaurantId", "$$restaurantId"] },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                  },
                },
                {
                  $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
                },
                { $sort: { createdAt: -1 } },
                {
                  $project: {
                    rate: 1,
                    type: 1,
                    description: 1,
                    "user.fullname": 1,
                    "user.photo": 1,
                  },
                },
              ],
              as: "comments",
            },
          },
          ...(Object.keys(matchConditions).length > 0
            ? [{ $match: matchConditions }]
            : []),
          {
            $lookup: {
              from: "albums",
              let: { restaurantId: { $toObjectId: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$restaurantId", "$$restaurantId"] },
                  },
                },
                {
                  $match: {
                    image: { $not: { $regex: "^data:image/png;base64," } },
                  },
                },
                { $sort: { createdAt: -1 } },
                { $project: { _id: 1, image: 1 } },
              ],
              as: "albums",
            },
          },

          {
            $addFields: {
              commentCount: { $size: "$comments" },
              albumCount: { $size: "$albums" },
              averageRate: {
                $round: [
                  {
                    $divide: [
                      {
                        $add: [
                          { $ifNull: ["$qualityRate", 0] },
                          { $ifNull: ["$serviceRate", 0] },
                          { $ifNull: ["$locationRate", 0] },
                          { $ifNull: ["$priceRate", 0] },
                          { $ifNull: ["$spaceRate", 0] },
                        ],
                      },
                      5,
                    ],
                  },
                  1,
                ],
              },
            },
          },
          {
            $project: {
              averageRate: 1,
              subCategory: { $arrayElemAt: ["$subCategoryDetails.name", 0] }, // Get the first element of the subCategoryDetails array
              timeOpen: 1,
              priceRange: 1,
              serviceRate: 1,
              locationRate: 1,
              priceRate: 1,
              spaceRate: 1,
              qualityRate: 1,
              name: 1,
              address: 1,
              image: 1,
              commentCount: 1,
              albumCount: 1,
              comments: 1,
              albums: 1,
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [{ $skip: skip }, { $limit: limit }], // Paging
            },
          },
        ]);

        const total = restaurants[0].metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);
        const docs = restaurants[0].data;

        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: docs.length,
          totalPages: totalPages,
          currentPage: page,
          data: { data: docs },
        });
      } catch (error) {
        console.error("Error fetching restaurants", error);
        return next(new AppError("Server error", 500));
      }
    });
  }

  getRestaurantById() {
    return getOne(this.restaurantModel, "districtId", [
      "coordinateId",
      "cuisinesId",
    ]);
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
  getRestaurantByRecommendation() {
    return catchAsync(async (req, res, next) => {
      const restaurantId = req.params.restaurantId;
      if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }
      const params = {
        campaignArn:
          "arn:aws:personalize:ap-southeast-1:390403892573:campaign/SIMS-campaign",
        itemId: restaurantId, // Dynamic restaurantId
        numResults: 5, // Optional parameter
      };

      try {
        const response = await personalizeRuntimeClient.send(
          new GetRecommendationsCommand(params)
        );
        if (!response?.itemList || response?.itemList === 0) {
          return next(
            new AppError(
              customResourceResponse.recordNotFound.message,
              customResourceResponse.recordNotFound.statusCode
            )
          );
        }
        const results = await Promise.all(
          response.itemList.map(({ itemId }) => getOneFetch(itemId))
        );

        // Gửi phản hồi
        res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: results.length,
          data: {
            data: results,
          },
        });
        return response;
      } catch (err) {
        return next(
          new AppError(
            err.message,
            customResourceResponse.serverError.statusCode
          )
        );
      }
    });
  }

  getNearestRestaurants() {
    return catchAsync(async (req, res, next) => {
      try {
        const {
          latitude,
          longitude,
          subCategory,
          cuisines,
          district,
          maxDistance,
        } = req.body;

        if (!latitude || !longitude) {
          return next(
            new AppError("Please provide latitude and longitude", 400)
          );
        }

        const maxDist = parseInt(maxDistance) || 1000;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Tạo điều kiện match
        let matchConditions = {};

        if (subCategory && mongoose.Types.ObjectId.isValid(subCategory)) {
          matchConditions["restaurant.subCategoryId"] =
            new mongoose.Types.ObjectId(subCategory);
        }
        if (district && mongoose.Types.ObjectId.isValid(district)) {
          matchConditions["restaurant.districtId"] =
            new mongoose.Types.ObjectId(district);
        }
        if (cuisines && mongoose.Types.ObjectId.isValid(cuisines)) {
          matchConditions["restaurant.cuisinesId"] =
            new mongoose.Types.ObjectId(cuisines);
        }

        const restaurants = await this.coordinateModel.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
              },
              distanceField: "distance",
              spherical: true,
              maxDistance: maxDist,
              key: "location",
            },
          },
          {
            $lookup: {
              from: "restaurants",
              localField: "_id",
              foreignField: "coordinateId",
              as: "restaurant",
            },
          },
          {
            $unwind: { path: "$restaurant", preserveNullAndEmptyArrays: false },
          },

          ...(Object.keys(matchConditions).length > 0
            ? [{ $match: matchConditions }]
            : []),

          {
            $addFields: {
              restaurantId: "$restaurant._id",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  "$restaurant",
                  { distance: "$distance", restaurantId: "$restaurantId" },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "comments",
              let: { restaurantId: "$restaurantId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$restaurantId", "$$restaurantId"] },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                  },
                },
                {
                  $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
                },
                { $sort: { createdAt: -1 } },
                {
                  $project: {
                    rate: 1,
                    type: 1,
                    description: 1,
                    "user.fullname": 1,
                    "user.photo": 1,
                  },
                },
              ],
              as: "comments",
            },
          },
          {
            $lookup: {
              from: "albums",
              let: { restaurantId: "$restaurantId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$restaurantId", "$$restaurantId"] },
                  },
                },
                {
                  $match: {
                    image: { $not: /^data:image\/png/ }, // Lọc bỏ image bắt đầu bằng "data:image/png"
                  },
                },
                { $sort: { createdAt: -1 } },
                { $project: { _id: 1, image: 1 } },
              ],
              as: "albums",
            },
          },

          {
            $addFields: {
              commentCount: { $size: "$comments" },
              albumCount: { $size: "$albums" },
            },
          },
          {
            $project: {
              _id: "$restaurantId",
              name: 1,
              image: 1,
              address: 1,
              serviceRate: 1,
              locationRate: 1,
              priceRate: 1,
              spaceRate: 1,
              qualityRate: 1,
              distance: 1,
              commentCount: 1,
              albumCount: 1,
              comments: 1,
              albums: 1,
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [{ $skip: skip }, { $limit: limit }],
            },
          },
        ]);

        const total = restaurants[0].metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);
        const docs = restaurants[0].data;

        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: docs.length,
          totalPages: totalPages,
          currentPage: page,
          data: { data: docs },
        });
      } catch (error) {
        console.error(error);
        return next(new AppError("Server error", 500));
      }
    });
  }
}
async function getOneFetch(itemId) {
  const response = await fetch(
    `http://localhost:3000/api/v1/restaurant/getRestaurant/${itemId}`
  );
  const data = await response.json();
  return data.data.data;
}
export default RestaurantRepository;
