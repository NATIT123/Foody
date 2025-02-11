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
    return createOne(this.commentModel);
  }

  getAllComments() {
    return getAll(this.commentModel, "userId,restaurantId");
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
