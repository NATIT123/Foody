import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import customResourceResponse from "../utils/constant.js";
import mongoose from "mongoose";
var FavoriteRestaurantRepository = /*#__PURE__*/function () {
  function FavoriteRestaurantRepository(favoriteRestaurantModel) {
    _classCallCheck(this, FavoriteRestaurantRepository);
    this.favoriteRestaurantModel = favoriteRestaurantModel;
  }
  return _createClass(FavoriteRestaurantRepository, [{
    key: "addFavoriteRestaurant",
    value: function addFavoriteRestaurant() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var _req$body, userId, restaurantId, restaurant, active;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, userId = _req$body.userId, restaurantId = _req$body.restaurantId;
                if (!(!userId.match(/^[0-9a-fA-F]{24}$/) || !restaurantId.match(/^[0-9a-fA-F]{24}$/))) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 4:
                _context.next = 6;
                return _this.favoriteRestaurantModel.findOne({
                  userId: new mongoose.Types.ObjectId(userId),
                  restaurantId: new mongoose.Types.ObjectId(restaurantId)
                }).sort({
                  createdAt: -1
                });
              case 6:
                restaurant = _context.sent;
                active = true;
                if (!restaurant) {
                  _context.next = 14;
                  break;
                }
                active = !restaurant.active;
                _context.next = 12;
                return _this.favoriteRestaurantModel.updateOne({
                  userId: userId,
                  restaurantId: restaurantId
                }, {
                  $set: {
                    active: active
                  }
                });
              case 12:
                _context.next = 16;
                break;
              case 14:
                _context.next = 16;
                return _this.favoriteRestaurantModel.create({
                  userId: userId,
                  restaurantId: restaurantId
                });
              case 16:
                return _context.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  data: {
                    active: active,
                    data: restaurantId
                  }
                }));
              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](0);
                console.error("Error fetching restaurant", _context.t0);
                return _context.abrupt("return", next(new AppError("Server error", 500)));
              case 23:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 19]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.favoriteRestaurantModel);
    }
  }, {
    key: "getFavoriteRestaurantById",
    value: function getFavoriteRestaurantById() {
      return getOne(this.favoriteRestaurantModel);
    }
  }, {
    key: "updateFavoriteRestaurantById",
    value: function updateFavoriteRestaurantById() {
      return updateOne(this.favoriteRestaurantModel);
    }
  }, {
    key: "deleteFavoriteRestaurantById",
    value: function deleteFavoriteRestaurantById() {
      return deleteOne(this.favoriteRestaurantModel);
    }
  }, {
    key: "getFavoriteRestaurantByUserId",
    value: function getFavoriteRestaurantByUserId() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var _req$query, _favorites$, _favorites$2, _req$body2, subCategory, cuisines, district, page, limit, skip, userId, matchConditions, favorites, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _req$body2 = req.body, subCategory = _req$body2.subCategory, cuisines = _req$body2.cuisines, district = _req$body2.district;
                console.log(req.body);
                page = Math.max(req.query.page * 1 || 1, 1);
                limit = Math.max(((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.limit) * 1 || 100, 1);
                skip = (page - 1) * limit;
                userId = new mongoose.Types.ObjectId(req.params.userId);
                matchConditions = {}; // Apply match conditions based on incoming filters
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
                _context2.next = 10;
                return _this2.favoriteRestaurantModel.aggregate([{
                  $match: {
                    active: true,
                    userId: userId
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $lookup: {
                    from: "restaurants",
                    localField: "restaurantId",
                    foreignField: "_id",
                    as: "restaurant"
                  }
                }, {
                  $unwind: "$restaurant"
                }, {
                  $lookup: {
                    from: "subcategories",
                    localField: "restaurant.subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    localField: "restaurant.districtId",
                    foreignField: "_id",
                    as: "districtDetails"
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    "let": {
                      restaurantId: "$restaurant._id"
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
                      restaurantId: "$restaurant._id"
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
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
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
                            $ifNull: ["$restaurant.qualityRate", 0]
                          }, {
                            $ifNull: ["$restaurant.serviceRate", 0]
                          }, {
                            $ifNull: ["$restaurant.locationRate", 0]
                          }, {
                            $ifNull: ["$restaurant.priceRate", 0]
                          }, {
                            $ifNull: ["$restaurant.spaceRate", 0]
                          }]
                        }, 5]
                      }, 1]
                    }
                  }
                }, {
                  $project: {
                    _id: "$restaurant._id",
                    name: "$restaurant.name",
                    address: "$restaurant.address",
                    image: "$restaurant.image",
                    timeOpen: "$restaurant.timeOpen",
                    priceRange: "$restaurant.priceRange",
                    serviceRate: "$restaurant.serviceRate",
                    locationRate: "$restaurant.locationRate",
                    priceRate: "$restaurant.priceRate",
                    spaceRate: "$restaurant.spaceRate",
                    qualityRate: "$restaurant.qualityRate",
                    comments: 1,
                    commentCount: 1,
                    albumCount: 1,
                    averageRate: 1,
                    albums: 1,
                    subCategory: {
                      $arrayElemAt: ["$subCategoryDetails.name", 0]
                    }
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
              case 10:
                favorites = _context2.sent;
                total = ((_favorites$ = favorites[0]) === null || _favorites$ === void 0 || (_favorites$ = _favorites$.metadata[0]) === null || _favorites$ === void 0 ? void 0 : _favorites$.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = ((_favorites$2 = favorites[0]) === null || _favorites$2 === void 0 ? void 0 : _favorites$2.data) || [];
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
              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2["catch"](0);
                console.error("Error fetching favorite restaurants", _context2.t0);
                return _context2.abrupt("return", next(new AppError("Server error", 500)));
              case 21:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 17]]);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getSavedRestaurantByUserId",
    value: function getSavedRestaurantByUserId() {
      var _this3 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
          var userId, restaurants, restaurantIdArray;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                userId = new mongoose.Types.ObjectId(req.params.userId);
                _context3.next = 4;
                return _this3.favoriteRestaurantModel.aggregate([{
                  $match: {
                    active: true,
                    userId: userId
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }, {
                  $project: {
                    _id: 0,
                    restaurantId: 1
                  }
                }]);
              case 4:
                restaurants = _context3.sent;
                restaurantIdArray = restaurants.map(function (r) {
                  return r.restaurantId.toString();
                });
                return _context3.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: restaurantIdArray.length,
                  data: {
                    data: restaurantIdArray
                  }
                }));
              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.error("Error fetching comments", _context3.t0);
                return _context3.abrupt("return", next(new AppError("Server error", 500)));
              case 13:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 9]]);
        }));
        return function (_x7, _x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default FavoriteRestaurantRepository;