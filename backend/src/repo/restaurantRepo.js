import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import mongoose from "mongoose";
// Import the required modules and clients
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

class RestaurantRepository {
  constructor(restaurantModel, coordinateModel) {
    this.restaurantModel = restaurantModel;
    this.coordinateModel = coordinateModel;
  }

  countRestaurants() {
    return catchAsync(async (req, res, next) => {
      try {
        const totalRestaurants = await this.restaurantModel.countDocuments();
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: totalRestaurants,
        });
      } catch (err) {
        return next(new AppError("Server error", 500));
      }
    });
  }

  addRestaurant() {
    return catchAsync(async (req, res, next) => {
      try {
        const {
          name,
          address,
          timeOpen,
          priceRange,
          ownerId,
          status,
          cuisinesId,
          subCategoryId,
          districtId,
        } = req.body;

        if (
          !cuisinesId.match(/^[0-9a-fA-F]{24}$/) ||
          !subCategoryId.match(/^[0-9a-fA-F]{24}$/)
        ) {
          return next(new AppError("User ID không hợp lệ!", 400));
        }

        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        let imageUrl = "";
        if (req.file) {
          const uploadStream = () => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "restaurants" },
                (error, result) => {
                  if (error) return reject(new AppError("Upload failed!", 500));
                  resolve(result.secure_url);
                }
              );
              stream.end(req.file.buffer);
            });
          };

          imageUrl = await uploadStream();
        }
        const newRestaurant = await this.restaurantModel.create({
          name,
          address,
          timeOpen,
          priceRange,
          image: imageUrl,
          ownerId,
          status,
          cuisinesId,
          subCategoryId,
          districtId,
        });

        res.status(201).json({
          message: "Nhà hàng đã được thêm thành công!",
          status: "success",
          restaurant: newRestaurant,
        });
      } catch (err) {
        console.log(err);
        return next(new AppError("Something went wrong!", 500));
      }
    });
  }

  fetchRestaurantsByRate() {
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
            $match: { active: true, status: "approved" },
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
            $addFields: {
              cityId: { $arrayElemAt: ["$districtDetails.cityId", 0] }, // Lấy cityId từ district
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
                    "user._id": 1,
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
            $sort: { averageScore: -1 },
          },
          {
            $project: {
              cityId: 1,
              districtId: 1,
              cuisinesId: 1,
              ownerId: 1,
              subCategoryId: 1,
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
            $match: { active: true, status: "approved" },
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
            $addFields: {
              cityId: { $arrayElemAt: ["$districtDetails.cityId", 0] }, // Lấy cityId từ district
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
                    numberOfLikes: 1,
                    replies: 1,
                    rate: 1,
                    type: 1,
                    description: 1,
                    "user.fullname": 1,
                    "user.photo": 1,
                    "user._id": 1,
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
              cityId: 1,
              districtId: 1,
              cuisinesId: 1,
              ownerId: 1,
              subCategoryId: 1,
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
  getOwnerRestaurants() {
    return catchAsync(async (req, res, next) => {
      try {
        const page = Math.max(req.query.page * 1 || 1, 1);
        const limit = Math.max(req.query.limit * 1 || 100, 1);
        const skip = (page - 1) * limit;
        const ownerId = req.params.ownerId;
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
          return next(new AppError("Invalid owner ID", 400));
        }

        // Điều kiện chỉ lấy nhà hàng do chủ sở hữu hiện tại tạo
        let matchConditions = {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          status: "approved",
          active: true,
        };

        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: matchConditions,
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
            $addFields: {
              cityId: { $arrayElemAt: ["$districtDetails.cityId", 0] },
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
                    "user._id": 1,
                  },
                },
              ],
              as: "comments",
            },
          },
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
              cityId: 1,
              districtId: 1,
              cuisinesId: 1,
              ownerId: 1,
              subCategoryId: 1,
              averageRate: 1,
              subCategory: { $arrayElemAt: ["$subCategoryDetails.name", 0] },
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
        console.error("Error fetching owner's restaurants", error);
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
    return catchAsync(async (req, res, next) => {
      try {
        const { id } = req.params; // Lấy ID của nhà hàng từ URL
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return next(new AppError("Invalid restaurant ID", 400));
        }

        // Kiểm tra xem có hình ảnh mới được tải lên không

        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        let imageUrl = req.body.image;
        if (req.file) {
          const uploadStream = () => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "restaurants" },
                (error, result) => {
                  if (error) return reject(new AppError("Upload failed!", 500));
                  resolve(result.secure_url);
                }
              );
              stream.end(req.file.buffer);
            });
          };
          imageUrl = await uploadStream();
        }

        const updateFields = { ...req.body, image: imageUrl };

        // Cập nhật nhà hàng trong DB
        const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
          id,
          updateFields,
          { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
          return next(new AppError("Restaurant not found", 404));
        }

        return res.status(200).json({
          status: "success",
          message: "Restaurant updated successfully",
          data: updatedRestaurant,
        });
      } catch (error) {
        console.error("Error updating restaurant:", error);
        return next(new AppError("Server error", 500));
      }
    });
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
            $sort: { averageRate: -1 },
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

  getRestaurantByFields() {
    return catchAsync(async (req, res, next) => {
      try {
        const { searchQuery } = req.query;
        const {
          subCategory,
          cuisines,
          district,
          selectedCity,
          selectedCategory,
        } = req.body;
        let matchConditions = {};

        if (Array.isArray(subCategory) && subCategory.length > 0) {
          matchConditions["subCategoryId"] = {
            $in: subCategory.map((id) => new mongoose.Types.ObjectId(id)),
          };
        }

        if (Array.isArray(district) && district.length > 0) {
          matchConditions["districtId"] = {
            $in: district.map((id) => new mongoose.Types.ObjectId(id)),
          };
        }

        if (Array.isArray(cuisines) && cuisines.length > 0) {
          matchConditions["cuisinesId"] = {
            $in: cuisines.map((id) => new mongoose.Types.ObjectId(id)),
          };
        }

        if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
          matchConditions["subCategoryDetails.categoryId"] =
            new mongoose.Types.ObjectId(selectedCategory);
        }

        if (mongoose.Types.ObjectId.isValid(selectedCity)) {
          matchConditions["districtDetails.cityId"] =
            new mongoose.Types.ObjectId(selectedCity);
        }

        if (searchQuery && searchQuery.trim() !== "") {
          matchConditions["$or"] = [
            { name: { $regex: searchQuery, $options: "i" } },
            { address: { $regex: searchQuery, $options: "i" } },
          ];
        }

        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: { active: true, status: "approved" },
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
          ...(Object.keys(matchConditions).length > 0
            ? [{ $match: matchConditions }]
            : []),

          {
            $project: {
              name: 1,
              address: 1,
              image: 1,
              timeOpen: 1,
            },
          },
        ]);

        const docs = restaurants;

        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: docs.length,
          data: { data: docs },
        });
      } catch (error) {
        console.error("Error fetching restaurants", error);
        return next(new AppError("Server error", 500));
      }
    });
  }
  getRestaurantByRecommendation() {
    return catchAsync(async (req, res, next) => {
      try {
        const { restaurantId, userId } = req.params;
        const { top, userLat, userLon } = req.body;

        // Kiểm tra định dạng ID hợp lệ
        if (
          !/^[0-9a-fA-F]{24}$/.test(restaurantId) ||
          !/^[0-9a-fA-F]{24}$/.test(userId)
        ) {
          return next(
            new AppError(
              customResourceResponse.notValidId.message,
              customResourceResponse.notValidId.statusCode
            )
          );
        }

        // Gọi API lấy danh sách nhà hàng được đề xuất
        const response = await axios.get(
          "http://127.0.0.1:8001/recommendations",
          {
            params: {
              user_id: userId,
              current_restaurant_id: restaurantId,
              top_n: top,
              user_lat: userLat,
              user_lon: userLon,
            },
          }
        );

        if (!response.data || !Array.isArray(response.data)) {
          return next(
            new AppError("Invalid response from recommendation API", 500)
          );
        }

        // Trả về phản hồi
        res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: response.data.length,
          data: { data: response.data },
        });
      } catch (error) {
        console.error("Error fetching recommended restaurants:", error);
        return next(
          new AppError(
            customResourceResponse.serverError.message,
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
          maxDistance,
          subCategory,
          cuisines,
          district,
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

        // Apply match conditions based on incoming filters
        if (mongoose.Types.ObjectId.isValid(subCategory)) {
          matchConditions["restaurant.subCategoryId"] =
            new mongoose.Types.ObjectId(subCategory);
        }
        if (mongoose.Types.ObjectId.isValid(district)) {
          matchConditions["restaurant.districtId"] =
            new mongoose.Types.ObjectId(district);
        }
        if (mongoose.Types.ObjectId.isValid(cuisines)) {
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
            $match: { active: true, "restaurant.status": "approved" },
          },
          {
            $unwind: { path: "$restaurant", preserveNullAndEmptyArrays: false },
          },

          {
            $lookup: {
              from: "subcategories",
              localField: "restaurant.subCategoryId",
              foreignField: "_id",
              as: "subCategory",
            },
          },
          {
            $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true },
          },

          {
            $lookup: {
              from: "cuisines",
              localField: "restaurant.cuisinesId",
              foreignField: "_id",
              as: "cuisines",
            },
          },
          {
            $unwind: { path: "$cuisines", preserveNullAndEmptyArrays: true },
          },

          {
            $lookup: {
              from: "districts",
              localField: "restaurant.districtId",
              foreignField: "_id",
              as: "districts",
            },
          },
          {
            $unwind: { path: "$district", preserveNullAndEmptyArrays: true },
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
                    "user._id": 1,
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

  getRestaurantByViews() {
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
            $match: { active: true, status: "approved" },
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
            $sort: { numberView: -1 },
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

  findRestaurantsByFields() {
    return catchAsync(async (req, res, next) => {
      try {
        const { searchQuery } = req.query;
        const page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
        const limit = Math.max(req.query?.limit * 1 || 100, 1); // Ensure limit is a positive integer
        const skip = (page - 1) * limit;
        let matchConditions = {};
        if (searchQuery && searchQuery.trim() !== "") {
          matchConditions["$or"] = [
            { name: { $regex: searchQuery, $options: "i" } },
            { address: { $regex: searchQuery, $options: "i" } },
            { "subCategory.name": { $regex: searchQuery, $options: "i" } },
          ];
        }
        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: { active: true, status: "approved" },
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
                    "user._id": 1,
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

  findRestaurantsOwnerByFields() {
    return catchAsync(async (req, res, next) => {
      try {
        const { searchQuery } = req.query;
        const page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
        const limit = Math.max(req.query?.limit * 1 || 100, 1); // Ensure limit is a positive integer
        const skip = (page - 1) * limit;
        const ownerId = req.params.ownerId;
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
          return next(new AppError("Invalid owner ID", 400));
        }

        // Điều kiện chỉ lấy nhà hàng do chủ sở hữu hiện tại tạo
        let matchConditions = { ownerId: new mongoose.Types.ObjectId(ownerId) };
        if (searchQuery && searchQuery.trim() !== "") {
          matchConditions["$or"] = [
            { name: { $regex: searchQuery, $options: "i" } },
            { address: { $regex: searchQuery, $options: "i" } },
            { phone: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { "subCategory.name": { $regex: searchQuery, $options: "i" } },
          ];
        }
        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: { active: true, status: "approved" },
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
                    "user._id": 1,
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

  getRestaunrantsPending() {
    return catchAsync(async (req, res, next) => {
      try {
        const page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
        const limit = Math.max(req.query?.limit * 1 || 100, 1); // Ensure limit is a positive integer
        const skip = (page - 1) * limit;

        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: { active: true, status: "pending" },
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
                    "user._id": 1,
                  },
                },
              ],
              as: "comments",
            },
          },

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

  findRestaurantsPendingByFields() {
    return catchAsync(async (req, res, next) => {
      try {
        const { searchQuery } = req.query;
        const page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
        const limit = Math.max(req.query?.limit * 1 || 100, 1); // Ensure limit is a positive integer
        const skip = (page - 1) * limit;
        // Điều kiện chỉ lấy nhà hàng do chủ sở hữu hiện tại tạo
        let matchConditions = { ownerId: new mongoose.Types.ObjectId(ownerId) };
        if (searchQuery && searchQuery.trim() !== "") {
          matchConditions["$or"] = [
            { name: { $regex: searchQuery, $options: "i" } },
            { address: { $regex: searchQuery, $options: "i" } },
            { "subCategory.name": { $regex: searchQuery, $options: "i" } },
          ];
        }
        const restaurants = await this.restaurantModel.aggregate([
          {
            $match: { active: true, status: "pending" },
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
                    "user._id": 1,
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

  updateStatus() {
    return catchAsync(async (req, res, next) => {
      try {
        const { restaurantId } = req.params;
        const { status } = req.body;

        if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
          return next(
            new AppError(
              customResourceResponse.notValidId.message,
              customResourceResponse.notValidId.statusCode
            )
          );
        }

        if (!["approved", "rejected"].includes(status)) {
          return next(new AppError("Invalid status value", 400));
        }

        const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
          restaurantId,
          { status },
          { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
          return next(new AppError("Restaurant not found", 404));
        }

        return res.status(200).json({
          message: "Status updated successfully",
          status: "success",
          data: updatedRestaurant,
        });
      } catch (error) {
        console.error("Error updating restaurant status", error);
        return next(new AppError("Server error", 500));
      }
    });
  }
}
export default RestaurantRepository;
