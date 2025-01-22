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
      const { categoryId } = req.params;
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }
      const features = new APIFeatures(this.subCategoryModel.find(), req.query)
        .sort()
        .limitFields()
        .populate();
      const doc = await features.query;

      console.log(doc);

      let results = doc.filter((item) => {
        return item.categoryId?._id.toString() === categoryId;
      });

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
        results: results.length,
        data: {
          data: results,
        },
      });
    });
  }
}

export default SubCategoryRepository;
