import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
class SubCategoryRepository {
  constructor(subCategoryModel, categoryModel) {
    this.categoryModel = categoryModel;
    this.subCategoryModel = subCategoryModel;
  }

  addsubCategory() {
    return createOne(this.subCategoryModel);
  }

  getAll() {
    return getAll(this.subCategoryModel);
  }

  getsubCategoryById() {
    return getOne(this.subCategoryModel, "categoryId");
  }

  updatesubCategoryById() {
    return updateOne(this.subCategoryModel);
  }

  deletesubCategoryById() {
    return deleteOne(this.subCategoryModel);
  }

  getSubCategoryByCategory() {
    return catchAsync(async (req, res, next) => {
      // Tìm category "Ăn uống"
      const category = await this.categoryModel.findOne({ name: "Ăn uống" });
      if (!category) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }

      // Tạo query với aggregation
      const features = new APIFeatures(
        this.subCategoryModel.aggregate([
          {
            $match: { categoryId: new mongoose.Types.ObjectId(category._id) }, // Lọc theo categoryId
          },
          {
            $sort: { createdAt: 1 }, // Sắp xếp theo createdAt tăng dần
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

export default SubCategoryRepository;
