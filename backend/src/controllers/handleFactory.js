import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";

export const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signInToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createRefreshToken = (payload) => {
  const refreshToken = jwt.sign(
    { payload },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );
  return refreshToken;
};

export const updateUserToken = (Model, refreshToken) =>
  catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(
        new AppError(
          customResourceResponse.notValidId.message,
          customResourceResponse.notValidId.statusCode
        )
      );
    }
    let user = await Model.findById(req.params.id);
    if (!user) {
      return next(
        new AppError(
          customResourceResponse.recordNotFound.message,
          customResourceResponse.recordNotFound.statusCode
        )
      );
    }
    res.clearCookie("refreshToken");
    await user.updateOne({ refreshToken });
    res.status(customResourceResponse.success.statusCode).json({
      message: customResourceResponse.success.message,
      status: "success",
    });
  });

export const createSendToken = (Model, user, statusCode, res) => {
  const token = signInToken(user._id, user.role);
  const refreshToken = createRefreshToken(user._id, user.role);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_REFRESH_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.clearCookie("refreshToken");
  res.cookie("refreshToken", refreshToken, cookieOptions);

  updateUserToken(Model, refreshToken, user._id);

  res.status(customResourceResponse.success.statusCode).json({
    message: customResourceResponse.success.message,
    status: "success",
    access_token: token,
    data: {
      user: user,
    },
  });
};

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
      data: { data: document._id },
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
      data: { data: document },
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
    let document = Model.findById(id);

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

export const getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = { active: true };
    const totalCount = await Model.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / 100);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .populate(options);
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
      totalPages: totalPages,
      page: req.query.page * 1 || 1,
      results: doc.length,
      data: {
        data: doc,
      },
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

    const document = await Model.findByIdAndUpdate(id, { active: false });

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
      data: { data: null },
    });
  });

export const importData = (Model, nameData) => {
  try {
    if (!nameData || typeof nameData !== "string") {
      throw new Error("Invalid nameData value. It must be a non-empty string.");
    }

    // Sử dụng đường dẫn tuyệt đối
    const dataPath = `./data/${nameData}.json`;
    console.log(`Reading file from path: ${dataPath}`);

    // Đọc dữ liệu từ file JSON
    const dataAdd = JSON.parse(fs.readFileSync(dataPath, "utf8")).map(
      (dataAdd) => ({
        ...dataAdd,
      })
    );

    // Tìm kiếm dữ liệu trong cơ sở dữ liệu
    Model.find()
      .then((data) => {
        if (data.length === 0) {
          Model.insertMany(dataAdd)
            .then(() => console.log("Data imported successfully"))
            .catch((err) => console.error("Error importing data:", err));
        } else {
          console.log(`Data ${nameData} already exists in the database.`);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  } catch (err) {
    console.error("Error reading or importing data:", err.message);
  }
};
