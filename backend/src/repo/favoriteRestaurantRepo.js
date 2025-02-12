import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import customResourceResponse from "../utils/constant.js";
import mongoose from "mongoose";

class FavoriteRestaurantRepository {
  constructor(favoriteRestaurantModel) {
    this.favoriteRestaurantModel = favoriteRestaurantModel;
  }

  addFavoriteRestaurant() {
    return createOne(this.favoriteRestaurantModel);
  }

  getAll() {
    return getAll(this.favoriteRestaurantModel);
  }

  getFavoriteRestaurantById() {
    return getOne(this.favoriteRestaurantModel);
  }

  updateFavoriteRestaurantById() {
    return updateOne(this.favoriteRestaurantModel);
  }

  deleteFavoriteRestaurantById() {
    return deleteOne(this.favoriteRestaurantModel);
  }

  getFavoriteRestaurantByUserId() {
    return catchAsync(async (req, res, next) => {
      try {
        const page = req.query.page * 1 || 1;
        const limit = req.query?.limit * 1 || 100;
        const skip = (page - 1) * limit;

        const userId = new mongoose.Types.ObjectId(req.params.userId);

        const comments = await this.favoriteRestaurantModel.aggregate([
          {
            $match: { active: true, userId: userId },
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
            $project: {
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
}
export default FavoriteRestaurantRepository;
