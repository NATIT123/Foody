import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import customResourceResponse from "../utils/constant.js";
import catchAsync from "../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";
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
    return catchAsync(async (req, res, next) => {
      try {
        const { id } = req.params;
        const { name, priceOriginal, priceDiscount } = req.body;

        // Kiểm tra ID hợp lệ
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return next(
            new AppError(
              customResourceResponse.notValidId.message,
              customResourceResponse.notValidId.statusCode
            )
          );
        }

        // Tìm món ăn theo ID
        let food = await this.foodModel.findById(id);
        if (!food) {
          return next(new AppError("Food not found!", 404));
        }

        // Nếu có ảnh mới, upload lên Cloudinary
        let imageUrl = food.image; // Giữ ảnh cũ mặc định
        if (req.file) {
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });

          const uploadStream = () => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "foods" }, // Lưu ảnh vào thư mục "foods" trên Cloudinary
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

        food = await this.foodModel.findByIdAndUpdate(
          id,
          { name, priceOriginal, priceDiscount, image: imageUrl },
          { new: true, runValidators: true }
        );

        res.status(customResourceResponse.success.statusCode).json({
          message: "Cập nhật món ăn thành công!",
          status: "success",
          data: { food },
        });
      } catch (err) {
        console.log(err);
        return next(new AppError("Something went wrong!", 500));
      }
    });
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
