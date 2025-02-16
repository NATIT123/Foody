import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
class CommentRepository {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  addComment() {
    return catchAsync(async (req, res, next) => {
      try {
        const { userId, restaurantId } = req.params;
        const { title, description, rate, time } = req.body;
        // Kiểm tra tính hợp lệ của cityId
        if (
          !userId.match(/^[0-9a-fA-F]{24}$/) ||
          !restaurantId.match(/^[0-9a-fA-F]{24}$/)
        ) {
          return next(
            new AppError(
              customResourceResponse.notValidId.message,
              customResourceResponse.notValidId.statusCode
            )
          );
        }
        const newComment = {
          title,
          description,
          time,
          rate,
          userId,
          restaurantId,
        };
        const savedComment = await this.commentModel.create(newComment);
        console.log(savedComment);
        res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          data: {
            data: savedComment._id.toString(),
          },
        });
      } catch (err) {
        console.log(err);
        return next(new AppError("Server Error", 500));
      }
    });
  }

  getAllComments() {
    return catchAsync(async (req, res, next) => {
      try {
        const page = req.query.page * 1 || 1;
        const limit = req.query?.limit * 1 || 100;
        const skip = (page - 1) * limit;

        const comments = await this.commentModel.aggregate([
          {
            $match: { active: true },
          },
          {
            $sort: { createdAt: -1 },
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
          {
            $lookup: {
              from: "restaurants",
              localField: "restaurantId",
              foreignField: "_id",
              as: "restaurant",
            },
          },
          {
            $unwind: { path: "$restaurant", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "albums",
              let: { restaurantId: "$restaurantId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$restaurantId", "$$restaurantId"] },
                    image: { $not: { $regex: "^data:image" } }, // Exclude base64 images
                  },
                },
                { $sort: { createdAt: -1 } }, // Get latest images
                { $limit: 5 }, // Get only 5 images
                { $project: { _id: 1, image: 1 } }, // Select required fields
              ],
              as: "restaurant.albums",
            },
          },
          {
            $addFields: {
              albumCount: { $size: "$restaurant.albums" },
            },
          },
          {
            $project: {
              "user._id": 1,
              "user.fullname": 1,
              "user.photo": 1,
              "restaurant.name": 1,
              "restaurant.address": 1,
              "restaurant.image": 1,
              "restaurant.albums": 1,
              "restaurant._id": 1,
              rate: 1,
              description: 1,
              time: 1,
              title: 1,
              type: 1,
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [{ $skip: skip }, { $limit: limit }],
            },
          },
        ]);

        const total = comments[0]?.metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);
        const docs = comments[0]?.data || [];

        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: docs.length,
          totalPages: totalPages,
          currentPage: page,
          data: {
            data: docs,
          },
        });
      } catch (error) {
        console.error("Error fetching comments", error);
        return next(new AppError("Server error", 500));
      }
    });
  }

  getCommentById() {
    return getOne(this.commentModel);
  }

  updateCommentById() {
    return updateOne(this.commentModel);
  }

  deleteCommentById() {
    return deleteOne(this.commentModel);
  }

  getCommentsByRestaurant() {
    return catchAsync(async (req, res, next) => {
      const restaurantId = req.params.restaurantId;
      // Kiểm tra tính hợp lệ của restaurantId
      if (!restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }

      // Tạo query với aggregation
      const features = new APIFeatures(
        this.commentModel.aggregate([
          {
            $lookup: {
              from: "restaurants", // Tên collection district
              localField: "restaurantId", // Trường trong collection restaurant
              foreignField: "_id", // Trường trong collection district
              as: "restaurant", // Kết quả join sẽ có trường "district"
            },
          },
          {
            $lookup: {
              from: "users", // Tên collection subcategory
              localField: "userId", // Trường trong collection restaurant
              foreignField: "_id", // Trường trong collection subcategory
              as: "user", // Kết quả join sẽ có trường "subcategory"
            },
          },
          {
            $sort: { createdAt: -1 }, // Sắp xếp theo averageSales và createdAt
          },
          {
            $match: {
              "restaurant._id": new mongoose.Types.ObjectId(restaurantId),
            },
          },

          {
            $limit: 10, // Lấy 10 bản ghi đầu tiên
          },
          {
            $project: {
              userId: 1,
              time: 1,
              rate: 1,
              title: 1,
              description: 1,
              type: 1,
              "user.fullname": 1,
              "user.photo": 1,
            },
          },
        ]),
        req.query
      ).limitFields();

      // Thực hiện truy vấn
      const doc = await features.query;

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
export default CommentRepository;
