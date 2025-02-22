import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
class DistrictRepository {
  constructor(districtModel) {
    this.districtModel = districtModel;
  }

  addDistrict() {
    return createOne(this.districtModel);
  }

  getAll() {
    return getAll(this.districtModel);
  }

  getDistrictById() {
    return getOne(this.districtModel, "districtId");
  }

  updateDistrictById() {
    return updateOne(this.districtModel);
  }

  deleteDistrictById() {
    return deleteOne(this.districtModel);
  }

  getDistrictsByCity() {
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
      console.log(cityId);
      const features = new APIFeatures(this.districtModel.find(), req.query)
        .sort()
        .limitFields()
        .populate();
      const doc = await features.query;

      let results = doc.filter((item) => {
        return item.cityId?._id.toString() === cityId.toString();
      });
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
export default DistrictRepository;
