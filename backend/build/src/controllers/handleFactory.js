import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import _regeneratorRuntime from "@babel/runtime/regenerator";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
export var filterObj = function filterObj(obj) {
  for (var _len = arguments.length, allowedFileds = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFileds[_key - 1] = arguments[_key];
  }
  var newObj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
var signInToken = function signInToken(id, role) {
  return jwt.sign({
    id: id,
    role: role
  }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
var createRefreshToken = function createRefreshToken(payload) {
  var refreshToken = jwt.sign({
    payload: payload
  }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
  return refreshToken;
};
export var updateUserToken = function updateUserToken(Model, refreshToken) {
  return catchAsync(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res) {
      var user;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (mongoose.Types.ObjectId.isValid(req.params.id)) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
          case 2:
            _context.next = 4;
            return Model.findById(req.params.id);
          case 4:
            user = _context.sent;
            if (user) {
              _context.next = 7;
              break;
            }
            return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
          case 7:
            res.clearCookie("refreshToken");
            _context.next = 10;
            return user.updateOne({
              refreshToken: refreshToken
            });
          case 10:
            res.status(customResourceResponse.success.statusCode).json({
              message: customResourceResponse.success.message,
              status: "success"
            });
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
export var createSendToken = function createSendToken(Model, user, statusCode, res) {
  var token = signInToken(user._id, user.role);
  var refreshToken = createRefreshToken(user._id, user.role);
  var cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
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
      user: user
    }
  });
};
export var createOne = function createOne(Model) {
  return catchAsync(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
      var document;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Model.create(req.body);
          case 2:
            document = _context2.sent;
            if (document) {
              _context2.next = 5;
              break;
            }
            return _context2.abrupt("return", next(new AppError(customResourceResponse.serverError.message, customResourceResponse.serverError.statusCode)));
          case 5:
            res.status(customResourceResponse.created.statusCode).json({
              status: "success",
              message: customResourceResponse.created.message,
              data: {
                data: document._id
              }
            });
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }());
};
export var updateOne = function updateOne(Model) {
  return catchAsync(/*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
      var id, document;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id; // ///Check ID is valid
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
              _context3.next = 3;
              break;
            }
            return _context3.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
          case 3:
            _context3.next = 5;
            return Model.findByIdAndUpdate(id, {
              $set: req.body
            }, {
              "new": true,
              runValidators: true
            });
          case 5:
            document = _context3.sent;
            if (document) {
              _context3.next = 8;
              break;
            }
            return _context3.abrupt("return", next(new AppError(customResourceResponse.recordNotFoundOne.message, customResourceResponse.recordNotFoundOne.statusCode)));
          case 8:
            res.status(customResourceResponse.success.statusCode).json({
              status: "success",
              message: customResourceResponse.success.message,
              data: {
                data: document
              }
            });
          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x6, _x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  }());
};
export var getOne = function getOne(Model, popOptions) {
  return catchAsync(/*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res, next) {
      var id, document, doc;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id; // ///Check ID is valid
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
              _context4.next = 3;
              break;
            }
            return _context4.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
          case 3:
            ///Return join collection child references and auto parse value according to _id
            document = Model.findById(id);
            if (popOptions) document = document.populate(popOptions);
            _context4.next = 7;
            return document;
          case 7:
            doc = _context4.sent;
            if (doc) {
              _context4.next = 10;
              break;
            }
            return _context4.abrupt("return", next(new AppError(customResourceResponse.recordNotFoundOne.message, customResourceResponse.recordNotFoundOne.statusCode)));
          case 10:
            res.status(customResourceResponse.success.statusCode).json({
              status: "success",
              message: customResourceResponse.success.message,
              data: {
                data: doc
              }
            });
          case 11:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function (_x9, _x10, _x11) {
      return _ref4.apply(this, arguments);
    };
  }());
};
export var getAll = function getAll(Model, options) {
  return catchAsync(/*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res, next) {
      var filter, features, doc;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            // To allow for nested GET reviews on tour (hack)
            filter = {
              isPublic: true
            };
            features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate().populate(options); // const doc = await features.query.explain();
            _context5.next = 4;
            return features.query;
          case 4:
            doc = _context5.sent;
            if (doc) {
              _context5.next = 7;
              break;
            }
            return _context5.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
          case 7:
            res.status(customResourceResponse.success.statusCode).json({
              message: customResourceResponse.success.message,
              status: "success",
              page: req.query.page * 1 || 1,
              results: doc.length,
              data: {
                data: doc
              }
            });
          case 8:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return function (_x12, _x13, _x14) {
      return _ref5.apply(this, arguments);
    };
  }());
};
export var deleteOne = function deleteOne(Model) {
  return catchAsync(/*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res, next) {
      var id, document;
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id; // ///Check ID is valid
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
              _context6.next = 3;
              break;
            }
            return _context6.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
          case 3:
            _context6.next = 5;
            return Model.findByIdAndUpdate(id, {
              active: false
            });
          case 5:
            document = _context6.sent;
            if (document) {
              _context6.next = 8;
              break;
            }
            return _context6.abrupt("return", next(new AppError(customResourceResponse.recordNotFoundOne.message, customResourceResponse.recordNotFoundOne.statusCode)));
          case 8:
            res.status(customResourceResponse.success.statusCode).json({
              status: "success",
              message: customResourceResponse.success.message,
              data: {
                data: null
              }
            });
          case 9:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function (_x15, _x16, _x17) {
      return _ref6.apply(this, arguments);
    };
  }());
};
export var importData = function importData(Model, nameData) {
  try {
    if (!nameData || typeof nameData !== "string") {
      throw new Error("Invalid nameData value. It must be a non-empty string.");
    }

    // Sử dụng đường dẫn tuyệt đối
    var dataPath = "./data/".concat(nameData, ".json");
    console.log("Reading file from path: ".concat(dataPath));

    // Đọc dữ liệu từ file JSON
    var dataAdd = JSON.parse(fs.readFileSync(dataPath, "utf8")).map(function (dataAdd) {
      return _objectSpread({}, dataAdd);
    });

    // Tìm kiếm dữ liệu trong cơ sở dữ liệu
    Model.find().then(function (data) {
      if (data.length === 0) {
        Model.insertMany(dataAdd).then(function () {
          return console.log("Data imported successfully");
        })["catch"](function (err) {
          return console.error("Error importing data:", err);
        });
      } else {
        console.log("Data ".concat(nameData, " already exists in the database."));
      }
    })["catch"](function (err) {
      return console.error("Error fetching data:", err);
    });
  } catch (err) {
    console.error("Error reading or importing data:", err.message);
  }
};