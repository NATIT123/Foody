import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../utils/appError.js";
import customResourceResponse from "../utils/constant.js";
import axios from "axios";
class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  countUsers() {
    return catchAsync(async (req, res, next) => {
      try {
        const totalUsers = await this.userModel.countDocuments();
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: totalUsers,
        });
      } catch (err) {
        return next(new AppError("Server error", 500));
      }
    });
  }

  addUser() {
    return createOne(this.userModel);
  }

  getAll() {
    return getAll(this.userModel);
  }

  getUserById() {
    return getOne(this.userModel);
  }

  updateUserById() {
    return updateOne(this.userModel);
  }

  deleteUserById() {
    return deleteOne(this.userModel);
  }
  uploadPhoto() {
    return catchAsync(async (req, res, next) => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      try {
        const uploadStream = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "users" },
              (error, result) => {
                if (error) return reject(new AppError("Upload failed!", 500));
                resolve(result.secure_url);
              }
            );
            stream.end(req.file.buffer);
          });
        };

        const imageUrl = await uploadStream();

        await this.userModel.findByIdAndUpdate(req.params.id, {
          photo: imageUrl,
        });

        res.status(200).json({
          message: "Upload thành công!",
          status: "success",
          data: { photo: imageUrl },
        });
      } catch (err) {
        return next(new AppError("Something went wrong!", 500));
      }
    });
  }
  getUserDetails() {
    return catchAsync(async (req, res, next) => {
      try {
        const { userId } = req.params;
        console.log(userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return next(new AppError("Invalid user ID", 400));
        }

        const userDetails = await this.userModel.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(userId) } },

          {
            $lookup: {
              from: "albums",
              let: { userId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$userId", "$$userId"] },
                  },
                },
                {
                  $lookup: {
                    from: "restaurants",
                    localField: "restaurantId",
                    foreignField: "_id",
                    as: "restaurant",
                  },
                },
                {
                  $unwind: {
                    path: "$restaurant",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: 1,
                    image: 1,
                    createdAt: 1,
                    restaurantName: "$restaurant.name",
                  },
                },
              ],
              as: "albums",
            },
          },

          {
            $lookup: {
              from: "favoriterestaurants",
              localField: "_id",
              foreignField: "userId",
              as: "favoriterestaurants",
            },
          },

          {
            $lookup: {
              from: "restaurants",
              localField: "favoriterestaurants.restaurantId",
              foreignField: "_id",
              as: "restaurantDetails",
            },
          },

          {
            $addFields: {
              favoriterestaurants: {
                $map: {
                  input: "$favoriterestaurants",
                  as: "fav",
                  in: {
                    _id: "$$fav._id",
                    userId: "$$fav.userId",
                    restaurantId: "$$fav.restaurantId",
                    restaurantInfo: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$restaurantDetails",
                            as: "restaurant",
                            cond: {
                              $eq: ["$$restaurant._id", "$$fav.restaurantId"],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                },
              },
            },
          },

          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "userId",
              as: "comments",
            },
          },

          { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },

          {
            $lookup: {
              from: "restaurants",
              localField: "comments.restaurantId",
              foreignField: "_id",
              as: "comments.restaurant",
            },
          },

          {
            $group: {
              _id: "$_id",
              fullname: { $first: "$fullname" },
              email: { $first: "$email" },
              phone: { $first: "$phone" },
              photo: { $first: "$photo" },
              address: { $first: "$address" },
              albums: { $first: "$albums" },
              favoriterestaurants: { $first: "$favoriterestaurants" },
              comments: { $push: "$comments" },
            },
          },

          {
            $project: {
              fullname: 1,
              photo: 1,
              "comments.title": 1,
              "comments.description": 1,
              "comments.restaurant.name": 1,
              "comments.restaurant.address": 1,
              "comments.restaurant.image": 1,
              "favoriterestaurants.restaurantInfo.image": 1,
              "favoriterestaurants.restaurantInfo.name": 1,
              "favoriterestaurants.restaurantInfo.address": 1,
              "favoriterestaurants.restaurantInfo._id": 1,
              albums: 1,
            },
          },
        ]);

        res.status(200).json({
          message: "Request has been processed successfully",
          status: "success",
          results: userDetails.length,
          data: {
            data: userDetails[0],
          },
        });
      } catch (error) {
        console.log(error);
        return next(new AppError("Server error", 500));
      }
    });
  }

  getAllDetails() {
    return catchAsync(async (req, res, next) => {
      try {
        const allUsers = await this.userModel.aggregate([
          {
            $lookup: {
              from: "albums",
              localField: "_id",
              foreignField: "userId",
              as: "albums",
            },
          },

          // Lookup comments
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "userId",
              as: "comments",
            },
          },

          // Đếm tổng số albums và comments
          {
            $addFields: {
              totalAlbums: { $size: "$albums" },
              totalComments: { $size: "$comments" },
              totalCount: {
                $sum: [{ $size: "$albums" }, { $size: "$comments" }],
              }, // Tổng số bình luận và albums
            },
          },

          // Sắp xếp theo tổng số giảm dần
          { $sort: { totalCount: -1 } },

          {
            $project: {
              _id: 1,
              fullname: 1,
              photo: 1,
              totalAlbums: 1,
              totalComments: 1,
            },
          },
        ]);

        res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: allUsers.length,
          data: {
            data: allUsers,
          },
        });
      } catch (error) {
        console.log(error);
        return next(new AppError("Server error", 500));
      }
    });
  }
  findUsersByFields() {
    return catchAsync(async (req, res, next) => {
      try {
        const { searchQuery } = req.query;
        const page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
        const limit = Math.max(req.query?.limit * 1 || 100, 1); // Ensure limit is a positive integer
        const skip = (page - 1) * limit;
        let matchConditions = {};
        if (searchQuery && searchQuery.trim() !== "") {
          matchConditions["$or"] = [
            { fullname: { $regex: searchQuery, $options: "i" } },
            { address: { $regex: searchQuery, $options: "i" } },
            { phone: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ];
        }
        const users = await this.userModel.aggregate([
          {
            $match: { active: true },
          },
          {
            $sort: { createdAt: -1 },
          },
          ...(Object.keys(matchConditions).length > 0
            ? [{ $match: matchConditions }]
            : []),

          {
            $project: {
              _id: 1,
              phone: 1,
              fullname: 1,
              address: 1,
              photo: 1,
              role: 1,
              email: 1,
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [{ $skip: skip }, { $limit: limit }], // Paging
            },
          },
        ]);
        const total = users[0].metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);
        const docs = users[0].data;

        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: docs.length,
          totalPages: totalPages,
          currentPage: page,
          data: { data: docs },
        });
      } catch (err) {
        console.error("Error fetching users", err);
        return next(new AppError("Server error", 500));
      }
    });
  }

  getChatBotResponse() {
    return catchAsync(async (req, res, next) => {
      try {
        const response = await axios.get("http://127.0.0.1:8005/chatbot", {
          params: {
            query: query,
            user_lat: userLat,
            user_lon: userLon,
          },
        });

        console.log("Chatbot response:", response.data);
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          data: { data: response.data },
        });
      } catch (error) {
        console.error("Error calling chatbot API:", error);
        return new AppError("Không thể nhận dữ liệu từ chatbot.", 500);
      }
    });
  }
  findUsersByRole() {
    return catchAsync(async (req, res, next) => {
      try {
        const userDetails = await this.userModel.aggregate([
          { $match: { role: "owner" } },
          {
            $project: {
              _id: 1,
              fullname: 1,
              address: 1,
            },
          },
        ]);

        res.status(200).json({
          message: "Request has been processed successfully",
          status: "success",
          results: userDetails.length,
          data: userDetails,
        });
      } catch (error) {
        console.log(error);
        return next(new AppError("Server error", 500));
      }
    });
  }
}
export default UserRepository;
