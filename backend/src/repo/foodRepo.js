import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import customResourceResponse from "../utils/constant.js";
import catchAsync from "../utils/catchAsync.js";
class FoodRepository {
  constructor(foodModel) {
    this.foodModel = foodModel;
  }

  addFood() {
    return createOne(this.foodModel);
  }

  getAllFoods() {
    return getAll(this.foodModel, "restaurantId");
  }

  getFoodById() {
    return getOne(this.foodModel);
  }

  updateFoodById() {
    return updateOne(this.foodModel);
  }

  deleteFoodById() {
    return deleteOne(this.foodModel);
  }

  getFoodSByRestaurant() {
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
      const doc = await this.foodModel.find({ restaurantId });
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
        results: doc.length,
        data: {
          data: doc,
        },
      });
    });
  }
}
export default FoodRepository;
