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
    return catchAsync(async (req, res, next) => {
      try {
        const { userId, restaurantId } = req.body;
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
        const restaurant = await this.favoriteRestaurantModel
          .findOne({
            userId: new mongoose.Types.ObjectId(userId),
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
          })
          .sort({ createdAt: -1 });

        let active = true;
        if (restaurant) {
          active = !restaurant.active;
          await this.favoriteRestaurantModel.updateOne(
            { userId: userId, restaurantId: restaurantId },
            { $set: { active } }
          );
        } else {
          await this.favoriteRestaurantModel.create({
            userId: userId,
            restaurantId: restaurantId,
          });
        }
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          data: {
            active,
            data: restaurantId,
          },
        });
      } catch (error) {
        console.error("Error fetching restaurant", error);
        return next(new AppError("Server error", 500));
      }
    });
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
        const { subCategory, cuisines, district } = req.body;
        console.log(req.body);
        const page = Math.max(req.query.page * 1 || 1, 1);
        const limit = Math.max(req.query?.limit * 1 || 100, 1);
        const skip = (page - 1) * limit;
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        let matchConditions = {};

        // Apply match conditions based on incoming filters
        // if (mongoose.Types.ObjectId.isValid(subCategory)) {
        //   matchConditions["restaurant.subCategoryId"] =
        //     new mongoose.Types.ObjectId(subCategory);
        // }
        // if (mongoose.Types.ObjectId.isValid(district)) {
        //   matchConditions["restaurant.districtId"] =
        //     new mongoose.Types.ObjectId(district);
        // }
        // if (mongoose.Types.ObjectId.isValid(cuisines)) {
        //   matchConditions["restaurant.cuisinesId"] =
        //     new mongoose.Types.ObjectId(cuisines);
        // }

        const favorites = await this.favoriteRestaurantModel.aggregate([
          { $match: { active: true, userId: userId } },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "restaurants",
              localField: "restaurantId",
              foreignField: "_id",
              as: "restaurant",
            },
          },
          { $unwind: "$restaurant" },
          {
            $lookup: {
              from: "subcategories",
              localField: "restaurant.subCategoryId",
              foreignField: "_id",
              as: "subCategoryDetails",
            },
          },
          {
            $lookup: {
              from: "districts",
              localField: "restaurant.districtId",
              foreignField: "_id",
              as: "districtDetails",
            },
          },
          {
            $lookup: {
              from: "comments",
              let: { restaurantId: "$restaurant._id" },
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
              localField: "restaurant._id",
              foreignField: "restaurantId",
              as: "albums",
            },
          },
          ...(Object.keys(matchConditions).length > 0
            ? [{ $match: matchConditions }]
            : []),
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
                          { $ifNull: ["$restaurant.qualityRate", 0] },
                          { $ifNull: ["$restaurant.serviceRate", 0] },
                          { $ifNull: ["$restaurant.locationRate", 0] },
                          { $ifNull: ["$restaurant.priceRate", 0] },
                          { $ifNull: ["$restaurant.spaceRate", 0] },
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
              _id: "$restaurant._id",
              name: "$restaurant.name",
              address: "$restaurant.address",
              image: "$restaurant.image",
              comments: 1,
              commentCount: 1,
              albumCount: 1,
              averageRate: 1,
              albums: 1,
              subCategory: { $arrayElemAt: ["$subCategoryDetails.name", 0] },
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [{ $skip: skip }, { $limit: limit }],
            },
          },
        ]);

        const total = favorites[0]?.metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);
        const docs = favorites[0]?.data || [];
        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: docs.length,
          totalPages: totalPages,
          currentPage: page,
          data: { data: docs },
        });
      } catch (error) {
        console.error("Error fetching favorite restaurants", error);
        return next(new AppError("Server error", 500));
      }
    });
  }

  getSavedRestaurantByUserId() {
    return catchAsync(async (req, res, next) => {
      try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        const restaurants = await this.favoriteRestaurantModel.aggregate([
          {
            $match: { active: true, userId: userId },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              _id: 0,
              restaurantId: 1,
            },
          },
        ]);

        const restaurantIdArray = restaurants.map((r) =>
          r.restaurantId.toString()
        );

        return res.status(customResourceResponse.success.statusCode).json({
          message: customResourceResponse.success.message,
          status: "success",
          results: restaurantIdArray.length,
          data: {
            data: restaurantIdArray,
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
