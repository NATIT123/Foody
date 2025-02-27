import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import mongoose from "mongoose";
// Import the required modules and clients
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
var RestaurantRepository = /*#__PURE__*/function () {
  function RestaurantRepository(restaurantModel, coordinateModel) {
    _classCallCheck(this, RestaurantRepository);
    this.restaurantModel = restaurantModel;
    this.coordinateModel = coordinateModel;
  }
  return _createClass(RestaurantRepository, [{
    key: "addRestaurant",
    value: function addRestaurant() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var _req$body, name, address, timeOpen, priceRange, ownerId, status, cuisinesId, subCategoryId, districtId, imageUrl, uploadStream, newRestaurant;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, name = _req$body.name, address = _req$body.address, timeOpen = _req$body.timeOpen, priceRange = _req$body.priceRange, ownerId = _req$body.ownerId, status = _req$body.status, cuisinesId = _req$body.cuisinesId, subCategoryId = _req$body.subCategoryId, districtId = _req$body.districtId;
                if (!(!cuisinesId.match(/^[0-9a-fA-F]{24}$/) || !subCategoryId.match(/^[0-9a-fA-F]{24}$/))) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", next(new AppError("User ID không hợp lệ!", 400)));
              case 4:
                cloudinary.config({
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY,
                  api_secret: process.env.CLOUDINARY_API_SECRET
                });
                imageUrl = "";
                if (!req.file) {
                  _context.next = 11;
                  break;
                }
                uploadStream = function uploadStream() {
                  return new Promise(function (resolve, reject) {
                    var stream = cloudinary.uploader.upload_stream({
                      folder: "restaurants"
                    }, function (error, result) {
                      if (error) return reject(new AppError("Upload failed!", 500));
                      resolve(result.secure_url);
                    });
                    stream.end(req.file.buffer);
                  });
                };
                _context.next = 10;
                return uploadStream();
              case 10:
                imageUrl = _context.sent;
              case 11:
                _context.next = 13;
                return _this.restaurantModel.create({
                  name: name,
                  address: address,
                  timeOpen: timeOpen,
                  priceRange: priceRange,
                  image: imageUrl,
                  ownerId: ownerId,
                  status: status,
                  cuisinesId: cuisinesId,
                  subCategoryId: subCategoryId,
                  districtId: districtId
                });
              case 13:
                newRestaurant = _context.sent;
                res.status(201).json({
                  message: "Nhà hàng đã được thêm thành công!",
                  status: "success",
                  restaurant: newRestaurant
                });
                _context.next = 21;
                break;
              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                return _context.abrupt("return", next(new AppError("Something went wrong!", 500)));
              case 21:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 17]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "fetchRestaurantsByRate",
    value: function fetchRestaurantsByRate() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var _req$query, _restaurants$0$metada, _req$body2, subCategory, cuisines, district, selectedCity, selectedCategory, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _req$body2 = req.body, subCategory = _req$body2.subCategory, cuisines = _req$body2.cuisines, district = _req$body2.district, selectedCity = _req$body2.selectedCity, selectedCategory = _req$body2.selectedCategory;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                matchConditions = {}; // Apply match conditions based on incoming filters
                if (mongoose.Types.ObjectId.isValid(subCategory)) {
                  matchConditions["subCategoryId"] = new mongoose.Types.ObjectId(subCategory);
                }
                if (mongoose.Types.ObjectId.isValid(district)) {
                  matchConditions["districtId"] = new mongoose.Types.ObjectId(district);
                }
                if (mongoose.Types.ObjectId.isValid(cuisines)) {
                  matchConditions["cuisinesId"] = new mongoose.Types.ObjectId(cuisines);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
                  matchConditions["subCategoryDetails.categoryId"] = new mongoose.Types.ObjectId(selectedCategory);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCity)) {
                  matchConditions["districtDetails.cityId"] = new mongoose.Types.ObjectId(selectedCity);
                }
                _context2.next = 13;
                return _this2.restaurantModel.aggregate([{
                  $match: {
                    active: true,
                    status: "approved"
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $addFields: {
                    cityId: {
                      $arrayElemAt: ["$districtDetails.cityId", 0]
                    } // Lấy cityId từ district
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1,
                        "user._id": 1
                      }
                    }],
                    as: "comments"
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $sort: {
                    averageScore: -1
                  }
                }, {
                  $project: {
                    cityId: 1,
                    districtId: 1,
                    cuisinesId: 1,
                    ownerId: 1,
                    subCategoryId: 1,
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    // Get the first element of the subCategoryDetails array
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }] // Paging
                  }
                }]));
              case 13:
                restaurants = _context2.sent;
                total = ((_restaurants$0$metada = restaurants[0].metadata[0]) === null || _restaurants$0$metada === void 0 ? void 0 : _restaurants$0$metada.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context2.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2["catch"](0);
                console.error("Error fetching restaurants", _context2.t0);
                return _context2.abrupt("return", next(new AppError("Server error", 500)));
              case 24:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 20]]);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getAllRestaurants",
    value: function getAllRestaurants() {
      var _this3 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
          var _req$query2, _restaurants$0$metada2, _req$body3, subCategory, cuisines, district, selectedCity, selectedCategory, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _req$body3 = req.body, subCategory = _req$body3.subCategory, cuisines = _req$body3.cuisines, district = _req$body3.district, selectedCity = _req$body3.selectedCity, selectedCategory = _req$body3.selectedCategory;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                matchConditions = {}; // Apply match conditions based on incoming filters
                if (mongoose.Types.ObjectId.isValid(subCategory)) {
                  matchConditions["subCategoryId"] = new mongoose.Types.ObjectId(subCategory);
                }
                if (mongoose.Types.ObjectId.isValid(district)) {
                  matchConditions["districtId"] = new mongoose.Types.ObjectId(district);
                }
                if (mongoose.Types.ObjectId.isValid(cuisines)) {
                  matchConditions["cuisinesId"] = new mongoose.Types.ObjectId(cuisines);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
                  matchConditions["subCategoryDetails.categoryId"] = new mongoose.Types.ObjectId(selectedCategory);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCity)) {
                  matchConditions["districtDetails.cityId"] = new mongoose.Types.ObjectId(selectedCity);
                }
                _context3.next = 13;
                return _this3.restaurantModel.aggregate([{
                  $match: {
                    active: true,
                    status: "approved"
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $addFields: {
                    cityId: {
                      $arrayElemAt: ["$districtDetails.cityId", 0]
                    } // Lấy cityId từ district
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1,
                        "user._id": 1
                      }
                    }],
                    as: "comments"
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $project: {
                    cityId: 1,
                    districtId: 1,
                    cuisinesId: 1,
                    ownerId: 1,
                    subCategoryId: 1,
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    // Get the first element of the subCategoryDetails array
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }] // Paging
                  }
                }]));
              case 13:
                restaurants = _context3.sent;
                total = ((_restaurants$0$metada2 = restaurants[0].metadata[0]) === null || _restaurants$0$metada2 === void 0 ? void 0 : _restaurants$0$metada2.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context3.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3["catch"](0);
                console.error("Error fetching restaurants", _context3.t0);
                return _context3.abrupt("return", next(new AppError("Server error", 500)));
              case 24:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 20]]);
        }));
        return function (_x7, _x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getOwnerRestaurants",
    value: function getOwnerRestaurants() {
      var _this4 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res, next) {
          var _restaurants$0$metada3, ownerId, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                ownerId = req.params.ownerId;
                if (mongoose.Types.ObjectId.isValid(ownerId)) {
                  _context4.next = 4;
                  break;
                }
                return _context4.abrupt("return", next(new AppError("Invalid owner ID", 400)));
              case 4:
                page = Math.max(req.query.page * 1 || 1, 1);
                limit = Math.max(req.query.limit * 1 || 100, 1);
                skip = (page - 1) * limit; // Điều kiện chỉ lấy nhà hàng do chủ sở hữu hiện tại tạo
                matchConditions = {
                  ownerId: new mongoose.Types.ObjectId(ownerId)
                };
                _context4.next = 10;
                return _this4.restaurantModel.aggregate([{
                  $match: matchConditions
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $addFields: {
                    cityId: {
                      $arrayElemAt: ["$districtDetails.cityId", 0]
                    }
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1,
                        "user._id": 1
                      }
                    }],
                    as: "comments"
                  }
                }, {
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $project: {
                    cityId: 1,
                    districtId: 1,
                    cuisinesId: 1,
                    ownerId: 1,
                    subCategoryId: 1,
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }]
                  }
                }]);
              case 10:
                restaurants = _context4.sent;
                total = ((_restaurants$0$metada3 = restaurants[0].metadata[0]) === null || _restaurants$0$metada3 === void 0 ? void 0 : _restaurants$0$metada3.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context4.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4["catch"](0);
                console.error("Error fetching owner's restaurants", _context4.t0);
                return _context4.abrupt("return", next(new AppError("Server error", 500)));
              case 21:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[0, 17]]);
        }));
        return function (_x10, _x11, _x12) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getRestaurantById",
    value: function getRestaurantById() {
      return getOne(this.restaurantModel, "districtId", ["coordinateId", "cuisinesId"]);
    }
  }, {
    key: "updateRestaurantById",
    value: function updateRestaurantById() {
      var _this5 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res, next) {
          var id, updateFields, updatedRestaurant;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                id = req.params.id; // Lấy ID của nhà hàng từ URL
                if (mongoose.Types.ObjectId.isValid(id)) {
                  _context5.next = 4;
                  break;
                }
                return _context5.abrupt("return", next(new AppError("Invalid restaurant ID", 400)));
              case 4:
                updateFields = _objectSpread({}, req.body); // Dữ liệu cập nhật từ request body
                // Kiểm tra xem có hình ảnh mới được tải lên không
                if (req.file) {
                  updateFields.image = req.file.path;
                }

                // Cập nhật nhà hàng trong DB
                _context5.next = 8;
                return _this5.restaurantModel.findByIdAndUpdate(id, updateFields, {
                  "new": true,
                  runValidators: true
                });
              case 8:
                updatedRestaurant = _context5.sent;
                if (updatedRestaurant) {
                  _context5.next = 11;
                  break;
                }
                return _context5.abrupt("return", next(new AppError("Restaurant not found", 404)));
              case 11:
                return _context5.abrupt("return", res.status(200).json({
                  status: "success",
                  message: "Restaurant updated successfully",
                  data: updatedRestaurant
                }));
              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](0);
                console.error("Error updating restaurant:", _context5.t0);
                return _context5.abrupt("return", next(new AppError("Server error", 500)));
              case 18:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 14]]);
        }));
        return function (_x13, _x14, _x15) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "deleteRestaurantById",
    value: function deleteRestaurantById() {
      return deleteOne(this.restaurantModel);
    }
  }, {
    key: "getByOptions",
    value: function getByOptions() {
      var _this6 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res, next) {
          var cityId, categoryId, features, doc;
          return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                cityId = req.params.cityId;
                categoryId = req.params.categoryId;
                if (!(!cityId.match(/^[0-9a-fA-F]{24}$/) || !categoryId.match(/^[0-9a-fA-F]{24}$/))) {
                  _context6.next = 4;
                  break;
                }
                return _context6.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 4:
                features = new APIFeatures(_this6.restaurantModel.find(), req.query).sort().limitFields().populate().paginate();
                _context6.next = 7;
                return features.query;
              case 7:
                doc = _context6.sent;
                console.log(doc.length);

                // const results = doc.filter((item) => {
                //   return (
                //     item.districtId?.cityId.toString() === cityId &&
                //     item.subCategoryId?.categoryId.toString() === categoryId
                //   );
                // });

                // const test = doc.filter((item) => {
                //   const itemReplace = item.cuisines.split(",").map((item) => {
                //     return item.replace(/ /g, "");
                //   });

                //   return itemReplace.includes("MónViệt");
                // });
                // console.log(test);
                // SEND RESPONSE
                if (doc) {
                  _context6.next = 11;
                  break;
                }
                return _context6.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 11:
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  page: req.query.page * 1 || 1,
                  results: doc.length,
                  data: {
                    data: results
                  }
                });
              case 12:
              case "end":
                return _context6.stop();
            }
          }, _callee6);
        }));
        return function (_x16, _x17, _x18) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getByCity",
    value: function getByCity() {
      var _this7 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee7(req, res, next) {
          var cityId, features, doc, results, page, limit, skip;
          return _regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                cityId = req.params.cityId;
                if (cityId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context7.next = 3;
                  break;
                }
                return _context7.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                features = new APIFeatures(_this7.restaurantModel.find(), req.query).sort().limitFields().populate();
                _context7.next = 6;
                return features.query;
              case 6:
                doc = _context7.sent;
                console.log(doc);
                results = doc.filter(function (item) {
                  var _item$districtId;
                  return ((_item$districtId = item.districtId) === null || _item$districtId === void 0 ? void 0 : _item$districtId.cityId.toString()) === cityId;
                });
                page = req.query.page * 1 || 1;
                limit = 100;
                skip = (page - 1) * limit;
                results = results.slice(skip, skip + limit);
                // SEND RESPONSE
                if (doc) {
                  _context7.next = 15;
                  break;
                }
                return _context7.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 15:
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  page: req.query.page * 1 || 1,
                  results: results.length,
                  data: {
                    data: results
                  }
                });
              case 16:
              case "end":
                return _context7.stop();
            }
          }, _callee7);
        }));
        return function (_x19, _x20, _x21) {
          return _ref7.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getTopDeals",
    value: function getTopDeals() {
      var _this8 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee8(req, res, next) {
          var _req$query3, _restaurants$0$metada4, _req$body4, subCategory, cuisines, district, selectedCity, selectedCategory, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _req$body4 = req.body, subCategory = _req$body4.subCategory, cuisines = _req$body4.cuisines, district = _req$body4.district, selectedCity = _req$body4.selectedCity, selectedCategory = _req$body4.selectedCategory;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query3 = req.query) === null || _req$query3 === void 0 ? void 0 : _req$query3.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                matchConditions = {}; // Apply match conditions based on incoming filters
                if (mongoose.Types.ObjectId.isValid(subCategory)) {
                  matchConditions["subCategoryId"] = new mongoose.Types.ObjectId(subCategory);
                }
                if (mongoose.Types.ObjectId.isValid(district)) {
                  matchConditions["districtId"] = new mongoose.Types.ObjectId(district);
                }
                if (mongoose.Types.ObjectId.isValid(cuisines)) {
                  matchConditions["cuisinesId"] = new mongoose.Types.ObjectId(cuisines);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
                  matchConditions["subCategoryDetails.categoryId"] = new mongoose.Types.ObjectId(selectedCategory);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCity)) {
                  matchConditions["districtDetails.cityId"] = new mongoose.Types.ObjectId(selectedCity);
                }
                _context8.next = 13;
                return _this8.restaurantModel.aggregate([{
                  $match: {
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1
                      }
                    }],
                    as: "comments"
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $sort: {
                    averageRate: -1
                  }
                }, {
                  $project: {
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    // Get the first element of the subCategoryDetails array
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }] // Paging
                  }
                }]));
              case 13:
                restaurants = _context8.sent;
                total = ((_restaurants$0$metada4 = restaurants[0].metadata[0]) === null || _restaurants$0$metada4 === void 0 ? void 0 : _restaurants$0$metada4.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context8.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 20:
                _context8.prev = 20;
                _context8.t0 = _context8["catch"](0);
                console.error("Error fetching restaurants", _context8.t0);
                return _context8.abrupt("return", next(new AppError("Server error", 500)));
              case 24:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[0, 20]]);
        }));
        return function (_x22, _x23, _x24) {
          return _ref8.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getRestaurantByFields",
    value: function getRestaurantByFields() {
      var _this9 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee9(req, res, next) {
          var searchQuery, _req$body5, subCategory, cuisines, district, selectedCity, selectedCategory, matchConditions, restaurants, docs;
          return _regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                searchQuery = req.query.searchQuery;
                _req$body5 = req.body, subCategory = _req$body5.subCategory, cuisines = _req$body5.cuisines, district = _req$body5.district, selectedCity = _req$body5.selectedCity, selectedCategory = _req$body5.selectedCategory;
                matchConditions = {};
                if (Array.isArray(subCategory) && subCategory.length > 0) {
                  matchConditions["subCategoryId"] = {
                    $in: subCategory.map(function (id) {
                      return new mongoose.Types.ObjectId(id);
                    })
                  };
                }
                if (Array.isArray(district) && district.length > 0) {
                  matchConditions["districtId"] = {
                    $in: district.map(function (id) {
                      return new mongoose.Types.ObjectId(id);
                    })
                  };
                }
                if (Array.isArray(cuisines) && cuisines.length > 0) {
                  matchConditions["cuisinesId"] = {
                    $in: cuisines.map(function (id) {
                      return new mongoose.Types.ObjectId(id);
                    })
                  };
                }
                if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
                  matchConditions["subCategoryDetails.categoryId"] = new mongoose.Types.ObjectId(selectedCategory);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCity)) {
                  matchConditions["districtDetails.cityId"] = new mongoose.Types.ObjectId(selectedCity);
                }
                if (searchQuery && searchQuery.trim() !== "") {
                  matchConditions["$or"] = [{
                    name: {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }, {
                    address: {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }];
                }
                _context9.next = 12;
                return _this9.restaurantModel.aggregate([{
                  $match: {
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $project: {
                    name: 1,
                    address: 1,
                    image: 1
                  }
                }]));
              case 12:
                restaurants = _context9.sent;
                docs = restaurants;
                return _context9.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  data: {
                    data: docs
                  }
                }));
              case 17:
                _context9.prev = 17;
                _context9.t0 = _context9["catch"](0);
                console.error("Error fetching restaurants", _context9.t0);
                return _context9.abrupt("return", next(new AppError("Server error", 500)));
              case 21:
              case "end":
                return _context9.stop();
            }
          }, _callee9, null, [[0, 17]]);
        }));
        return function (_x25, _x26, _x27) {
          return _ref9.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getRestaurantByRecommendation",
    value: function getRestaurantByRecommendation() {
      return catchAsync(/*#__PURE__*/function () {
        var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee10(req, res, next) {
          var _req$params, restaurantId, userId, _req$body6, top, userLat, userLon, response;
          return _regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _req$params = req.params, restaurantId = _req$params.restaurantId, userId = _req$params.userId;
                _req$body6 = req.body, top = _req$body6.top, userLat = _req$body6.userLat, userLon = _req$body6.userLon; // Kiểm tra định dạng ID hợp lệ
                if (!(!/^[0-9a-fA-F]{24}$/.test(restaurantId) || !/^[0-9a-fA-F]{24}$/.test(userId))) {
                  _context10.next = 5;
                  break;
                }
                return _context10.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 5:
                _context10.next = 7;
                return axios.get("http://127.0.0.1:8001/recommendations", {
                  params: {
                    user_id: userId,
                    current_restaurant_id: restaurantId,
                    top_n: top,
                    user_lat: userLat,
                    user_lon: userLon
                  }
                });
              case 7:
                response = _context10.sent;
                if (!(!response.data || !Array.isArray(response.data))) {
                  _context10.next = 10;
                  break;
                }
                return _context10.abrupt("return", next(new AppError("Invalid response from recommendation API", 500)));
              case 10:
                // Trả về phản hồi
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: response.data.length,
                  data: {
                    data: response.data
                  }
                });
                _context10.next = 17;
                break;
              case 13:
                _context10.prev = 13;
                _context10.t0 = _context10["catch"](0);
                console.error("Error fetching recommended restaurants:", _context10.t0);
                return _context10.abrupt("return", next(new AppError(customResourceResponse.serverError.message, customResourceResponse.serverError.statusCode)));
              case 17:
              case "end":
                return _context10.stop();
            }
          }, _callee10, null, [[0, 13]]);
        }));
        return function (_x28, _x29, _x30) {
          return _ref10.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getNearestRestaurants",
    value: function getNearestRestaurants() {
      var _this10 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee11(req, res, next) {
          var _restaurants$0$metada5, _req$body7, latitude, longitude, maxDistance, maxDist, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _req$body7 = req.body, latitude = _req$body7.latitude, longitude = _req$body7.longitude, maxDistance = _req$body7.maxDistance;
                if (!(!latitude || !longitude)) {
                  _context11.next = 4;
                  break;
                }
                return _context11.abrupt("return", next(new AppError("Please provide latitude and longitude", 400)));
              case 4:
                maxDist = parseInt(maxDistance) || 1000;
                page = parseInt(req.query.page) || 1;
                limit = parseInt(req.query.limit) || 10;
                skip = (page - 1) * limit; // Tạo điều kiện match
                matchConditions = {};
                _context11.next = 11;
                return _this10.coordinateModel.aggregate([{
                  $geoNear: {
                    near: {
                      type: "Point",
                      coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    distanceField: "distance",
                    spherical: true,
                    maxDistance: maxDist,
                    key: "location"
                  }
                }, {
                  $lookup: {
                    from: "restaurants",
                    localField: "_id",
                    foreignField: "coordinateId",
                    as: "restaurant"
                  }
                }, {
                  $unwind: {
                    path: "$restaurant",
                    preserveNullAndEmptyArrays: false
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $addFields: {
                    restaurantId: "$restaurant._id"
                  }
                }, {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: ["$restaurant", {
                        distance: "$distance",
                        restaurantId: "$restaurantId"
                      }]
                    }
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: "$restaurantId"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1,
                        "user._id": 1
                      }
                    }],
                    as: "comments"
                  }
                }, {
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: "$restaurantId"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: /^data:image\/png/
                        } // Lọc bỏ image bắt đầu bằng "data:image/png"
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    }
                  }
                }, {
                  $project: {
                    _id: "$restaurantId",
                    name: 1,
                    image: 1,
                    address: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    distance: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }]
                  }
                }]));
              case 11:
                restaurants = _context11.sent;
                total = ((_restaurants$0$metada5 = restaurants[0].metadata[0]) === null || _restaurants$0$metada5 === void 0 ? void 0 : _restaurants$0$metada5.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context11.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 18:
                _context11.prev = 18;
                _context11.t0 = _context11["catch"](0);
                console.error(_context11.t0);
                return _context11.abrupt("return", next(new AppError("Server error", 500)));
              case 22:
              case "end":
                return _context11.stop();
            }
          }, _callee11, null, [[0, 18]]);
        }));
        return function (_x31, _x32, _x33) {
          return _ref11.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getRestaurantByViews",
    value: function getRestaurantByViews() {
      var _this11 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee12(req, res, next) {
          var _req$query4, _restaurants$0$metada6, _req$body8, subCategory, cuisines, district, selectedCity, selectedCategory, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                _req$body8 = req.body, subCategory = _req$body8.subCategory, cuisines = _req$body8.cuisines, district = _req$body8.district, selectedCity = _req$body8.selectedCity, selectedCategory = _req$body8.selectedCategory;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query4 = req.query) === null || _req$query4 === void 0 ? void 0 : _req$query4.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                matchConditions = {}; // Apply match conditions based on incoming filters
                if (mongoose.Types.ObjectId.isValid(subCategory)) {
                  matchConditions["subCategoryId"] = new mongoose.Types.ObjectId(subCategory);
                }
                if (mongoose.Types.ObjectId.isValid(district)) {
                  matchConditions["districtId"] = new mongoose.Types.ObjectId(district);
                }
                if (mongoose.Types.ObjectId.isValid(cuisines)) {
                  matchConditions["cuisinesId"] = new mongoose.Types.ObjectId(cuisines);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCategory)) {
                  matchConditions["subCategoryDetails.categoryId"] = new mongoose.Types.ObjectId(selectedCategory);
                }
                if (mongoose.Types.ObjectId.isValid(selectedCity)) {
                  matchConditions["districtDetails.cityId"] = new mongoose.Types.ObjectId(selectedCity);
                }
                _context12.next = 13;
                return _this11.restaurantModel.aggregate([{
                  $match: {
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1
                      }
                    }],
                    as: "comments"
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $sort: {
                    numberView: -1
                  }
                }, {
                  $project: {
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    // Get the first element of the subCategoryDetails array
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }] // Paging
                  }
                }]));
              case 13:
                restaurants = _context12.sent;
                total = ((_restaurants$0$metada6 = restaurants[0].metadata[0]) === null || _restaurants$0$metada6 === void 0 ? void 0 : _restaurants$0$metada6.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context12.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 20:
                _context12.prev = 20;
                _context12.t0 = _context12["catch"](0);
                console.error("Error fetching restaurants", _context12.t0);
                return _context12.abrupt("return", next(new AppError("Server error", 500)));
              case 24:
              case "end":
                return _context12.stop();
            }
          }, _callee12, null, [[0, 20]]);
        }));
        return function (_x34, _x35, _x36) {
          return _ref12.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "findRestaurantsByFields",
    value: function findRestaurantsByFields() {
      var _this12 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee13(req, res, next) {
          var _req$query5, _restaurants$0$metada7, searchQuery, page, limit, skip, matchConditions, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                searchQuery = req.query.searchQuery;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query5 = req.query) === null || _req$query5 === void 0 ? void 0 : _req$query5.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                matchConditions = {};
                if (searchQuery && searchQuery.trim() !== "") {
                  matchConditions["$or"] = [{
                    name: {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }, {
                    address: {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }, {
                    phone: {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }, {
                    email: {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }, {
                    "subCategory.name": {
                      $regex: searchQuery,
                      $options: "i"
                    }
                  }];
                }
                _context13.next = 9;
                return _this12.restaurantModel.aggregate([{
                  $match: {
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1,
                        "user._id": 1
                      }
                    }],
                    as: "comments"
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $project: {
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    // Get the first element of the subCategoryDetails array
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }] // Paging
                  }
                }]));
              case 9:
                restaurants = _context13.sent;
                total = ((_restaurants$0$metada7 = restaurants[0].metadata[0]) === null || _restaurants$0$metada7 === void 0 ? void 0 : _restaurants$0$metada7.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context13.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 16:
                _context13.prev = 16;
                _context13.t0 = _context13["catch"](0);
                console.error("Error fetching restaurants", _context13.t0);
                return _context13.abrupt("return", next(new AppError("Server error", 500)));
              case 20:
              case "end":
                return _context13.stop();
            }
          }, _callee13, null, [[0, 16]]);
        }));
        return function (_x37, _x38, _x39) {
          return _ref13.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getRestaunrantsPending",
    value: function getRestaunrantsPending() {
      var _this13 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee14(req, res, next) {
          var _req$query6, _restaurants$0$metada8, page, limit, skip, restaurants, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query6 = req.query) === null || _req$query6 === void 0 ? void 0 : _req$query6.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                _context14.next = 6;
                return _this13.restaurantModel.aggregate([{
                  $match: {
                    active: true,
                    status: "pending"
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                      }
                    }, {
                      $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        rate: 1,
                        type: 1,
                        description: 1,
                        "user.fullname": 1,
                        "user.photo": 1,
                        "user._id": 1
                      }
                    }],
                    as: "comments"
                  }
                }, {
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: {
                        $toObjectId: "$_id"
                      }
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        }
                      }
                    }, {
                      $match: {
                        image: {
                          $not: {
                            $regex: "^data:image/png;base64,"
                          }
                        }
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $addFields: {
                    commentCount: {
                      $size: "$comments"
                    },
                    albumCount: {
                      $size: "$albums"
                    },
                    averageRate: {
                      $round: [{
                        $divide: [{
                          $add: [{
                            $ifNull: ["$qualityRate", 0]
                          }, {
                            $ifNull: ["$serviceRate", 0]
                          }, {
                            $ifNull: ["$locationRate", 0]
                          }, {
                            $ifNull: ["$priceRate", 0]
                          }, {
                            $ifNull: ["$spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $project: {
                    averageRate: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    },
                    // Get the first element of the subCategoryDetails array
                    timeOpen: 1,
                    priceRange: 1,
                    serviceRate: 1,
                    locationRate: 1,
                    priceRate: 1,
                    spaceRate: 1,
                    qualityRate: 1,
                    name: 1,
                    address: 1,
                    image: 1,
                    commentCount: 1,
                    albumCount: 1,
                    comments: 1,
                    albums: 1
                  }
                }, {
                  $facet: {
                    metadata: [{
                      $count: "total"
                    }],
                    data: [{
                      $skip: skip
                    }, {
                      $limit: limit
                    }] // Paging
                  }
                }]);
              case 6:
                restaurants = _context14.sent;
                total = ((_restaurants$0$metada8 = restaurants[0].metadata[0]) === null || _restaurants$0$metada8 === void 0 ? void 0 : _restaurants$0$metada8.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = restaurants[0].data;
                return _context14.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: docs.length,
                  totalPages: totalPages,
                  currentPage: page,
                  data: {
                    data: docs
                  }
                }));
              case 13:
                _context14.prev = 13;
                _context14.t0 = _context14["catch"](0);
                console.error("Error fetching restaurants", _context14.t0);
                return _context14.abrupt("return", next(new AppError("Server error", 500)));
              case 17:
              case "end":
                return _context14.stop();
            }
          }, _callee14, null, [[0, 13]]);
        }));
        return function (_x40, _x41, _x42) {
          return _ref14.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "updateStatus",
    value: function updateStatus() {
      var _this14 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref15 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee15(req, res, next) {
          var restaurantId, status, updatedRestaurant;
          return _regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                restaurantId = req.params.restaurantId;
                status = req.body.status;
                if (restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context15.next = 5;
                  break;
                }
                return _context15.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 5:
                if (["approved", "rejected"].includes(status)) {
                  _context15.next = 7;
                  break;
                }
                return _context15.abrupt("return", next(new AppError("Invalid status value", 400)));
              case 7:
                _context15.next = 9;
                return _this14.restaurantModel.findByIdAndUpdate(restaurantId, {
                  status: status
                }, {
                  "new": true,
                  runValidators: true
                });
              case 9:
                updatedRestaurant = _context15.sent;
                if (updatedRestaurant) {
                  _context15.next = 12;
                  break;
                }
                return _context15.abrupt("return", next(new AppError("Restaurant not found", 404)));
              case 12:
                return _context15.abrupt("return", res.status(200).json({
                  message: "Status updated successfully",
                  status: "success",
                  data: updatedRestaurant
                }));
              case 15:
                _context15.prev = 15;
                _context15.t0 = _context15["catch"](0);
                console.error("Error updating restaurant status", _context15.t0);
                return _context15.abrupt("return", next(new AppError("Server error", 500)));
              case 19:
              case "end":
                return _context15.stop();
            }
          }, _callee15, null, [[0, 15]]);
        }));
        return function (_x43, _x44, _x45) {
          return _ref15.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default RestaurantRepository;