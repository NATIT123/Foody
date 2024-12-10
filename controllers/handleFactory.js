import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    if (!document) {
      return next(
        new AppError(
          customResourceResponse.serverError.message,
          customResourceResponse.serverError.statusCode
        )
      );
    }
    res.status(customResourceResponse.created.statusCode).json({
      status: "success",
      message: customResourceResponse.created.message,
      data: { data: doc._id },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // ///Check ID is valid
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new AppError(
          customResourceResponse.notValidId.message,
          customResourceResponse.notValidId.statusCode
        )
      );
    }

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(
        new AppError(
          customResourceResponse.recordNotFoundOne.message,
          customResourceResponse.recordNotFoundOne.statusCode
        )
      );
    }
    res.status(customResourceResponse.success.statusCode).json({
      status: "success",
      message: customResourceResponse.success.message,
      data: { data: doc },
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // ///Check ID is valid
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new AppError(
          customResourceResponse.notValidId.message,
          customResourceResponse.notValidId.statusCode
        )
      );
    }

    const document = await Model.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!document) {
      return next(
        new AppError(
          customResourceResponse.recordNotFoundOne.message,
          customResourceResponse.recordNotFoundOne.statusCode
        )
      );
    }
    res.status(customResourceResponse.success.statusCode).json({
      status: "success",
      message: customResourceResponse.success.message,
      data: { data: doc },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    // ///Check ID is valid
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new AppError(
          customResourceResponse.notValidId.message,
          customResourceResponse.notValidId.statusCode
        )
      );
    }

    ///Return join collection child references and auto parse value according to _id
    const document = Model.findById(id);

    if (popOptions) document = document.populate(popOptions);

    const doc = await document;

    //  await tour.findById(id);
    // await tour.findById(id).populate('guides');
    // console.log(tourDetail);
    // await tour.findOne({ _id: id });
    if (!doc) {
      return next(
        new AppError(
          customResourceResponse.recordNotFoundOne.message,
          customResourceResponse.recordNotFoundOne.statusCode
        )
      );
    }
    res.status(customResourceResponse.success.statusCode).json({
      status: "success",
      message: customResourceResponse.success.message,
      data: { data: doc },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

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
