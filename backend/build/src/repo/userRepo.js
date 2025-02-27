import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../utils/appError.js";
import customResourceResponse from "../utils/constant.js";
import axios from "axios";
var UserRepository = /*#__PURE__*/function () {
  function UserRepository(userModel) {
    _classCallCheck(this, UserRepository);
    this.userModel = userModel;
  }
  return _createClass(UserRepository, [{
    key: "addUser",
    value: function addUser() {
      return createOne(this.userModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.userModel);
    }
  }, {
    key: "getUserById",
    value: function getUserById() {
      return getOne(this.userModel);
    }
  }, {
    key: "updateUserById",
    value: function updateUserById() {
      return updateOne(this.userModel);
    }
  }, {
    key: "deleteUserById",
    value: function deleteUserById() {
      return deleteOne(this.userModel);
    }
  }, {
    key: "uploadPhoto",
    value: function uploadPhoto() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var uploadStream, imageUrl;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                cloudinary.config({
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY,
                  api_secret: process.env.CLOUDINARY_API_SECRET
                });
                _context.prev = 1;
                uploadStream = function uploadStream() {
                  return new Promise(function (resolve, reject) {
                    var stream = cloudinary.uploader.upload_stream({
                      folder: "users"
                    }, function (error, result) {
                      if (error) return reject(new AppError("Upload failed!", 500));
                      resolve(result.secure_url);
                    });
                    stream.end(req.file.buffer);
                  });
                };
                _context.next = 5;
                return uploadStream();
              case 5:
                imageUrl = _context.sent;
                _context.next = 8;
                return _this.userModel.findByIdAndUpdate(req.params.id, {
                  photo: imageUrl
                });
              case 8:
                res.status(200).json({
                  message: "Upload thành công!",
                  status: "success",
                  data: {
                    photo: imageUrl
                  }
                });
                _context.next = 14;
                break;
              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", next(new AppError("Something went wrong!", 500)));
              case 14:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1, 11]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getUserDetails",
    value: function getUserDetails() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var userId, userDetails;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                userId = req.params.userId;
                _context2.next = 4;
                return _this2.userModel.aggregate([{
                  $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                  }
                }, {
                  $lookup: {
                    from: "albums",
                    "let": {
                      userId: "$_id"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$userId", "$$userId"]
                        }
                      }
                    }, {
                      $lookup: {
                        from: "restaurants",
                        localField: "restaurantId",
                        foreignField: "_id",
                        as: "restaurant"
                      }
                    }, {
                      $unwind: {
                        path: "$restaurant",
                        preserveNullAndEmptyArrays: true
                      }
                    }, {
                      $project: {
                        _id: 1,
                        image: 1,
                        createdAt: 1,
                        restaurantName: "$restaurant.name"
                      }
                    }],
                    as: "albums"
                  }
                }, {
                  $lookup: {
                    from: "favoriterestaurants",
                    localField: "_id",
                    foreignField: "userId",
                    as: "favoriterestaurants"
                  }
                }, {
                  $lookup: {
                    from: "restaurants",
                    localField: "favoriterestaurants.restaurantId",
                    foreignField: "_id",
                    as: "restaurantDetails"
                  }
                }, {
                  $addFields: {
                    favoriterestaurants: {
                      $map: {
                        input: "$favoriterestaurants",
                        as: "fav",
                        "in": {
                          _id: "$$fav._id",
                          userId: "$$fav.userId",
                          restaurantId: "$$fav.restaurantId",
                          restaurantInfo: {
                            $arrayElemAt: [{
                              $filter: {
                                input: "$restaurantDetails",
                                as: "restaurant",
                                cond: {
                                  $eq: ["$$restaurant._id", "$$fav.restaurantId"]
                                }
                              }
                            }, 0]
                          }
                        }
                      }
                    }
                  }
                }, {
                  $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "userId",
                    as: "comments"
                  }
                }, {
                  $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $lookup: {
                    from: "restaurants",
                    localField: "comments.restaurantId",
                    foreignField: "_id",
                    as: "comments.restaurant"
                  }
                }, {
                  $group: {
                    _id: "$_id",
                    fullname: {
                      $first: "$fullname"
                    },
                    email: {
                      $first: "$email"
                    },
                    phone: {
                      $first: "$phone"
                    },
                    photo: {
                      $first: "$photo"
                    },
                    address: {
                      $first: "$address"
                    },
                    albums: {
                      $first: "$albums"
                    },
                    favoriterestaurants: {
                      $first: "$favoriterestaurants"
                    },
                    comments: {
                      $push: "$comments"
                    }
                  }
                }, {
                  $project: {
                    fullname: 1,
                    photo: 1,
                    "comments.title": 1,
                    "comments.description": 1,
                    "comments.restaurant.name": 1,
                    "comments.restaurant.address": 1,
                    "comments.restaurant.image": 1,
                    "favoriterestaurants.restaurantInfo.image": 1,
                    "favoriterestaurants.restaurantInfo.name": 1,
                    "favoriterestaurants.restaurantInfo.address": 1,
                    "favoriterestaurants.restaurantInfo._id": 1,
                    albums: 1
                  }
                }]);
              case 4:
                userDetails = _context2.sent;
                res.status(200).json({
                  message: "Request has been processed successfully",
                  status: "success",
                  results: userDetails.length,
                  data: {
                    data: userDetails[0]
                  }
                });
                _context2.next = 12;
                break;
              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                return _context2.abrupt("return", next(new AppError("Server error", 500)));
              case 12:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 8]]);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getAllDetails",
    value: function getAllDetails() {
      var _this3 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
          var allUsers;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _this3.userModel.aggregate([{
                  $lookup: {
                    from: "albums",
                    localField: "_id",
                    foreignField: "userId",
                    as: "albums"
                  }
                },
                // Lookup comments
                {
                  $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "userId",
                    as: "comments"
                  }
                },
                // Đếm tổng số albums và comments
                {
                  $addFields: {
                    totalAlbums: {
                      $size: "$albums"
                    },
                    totalComments: {
                      $size: "$comments"
                    },
                    totalCount: {
                      $sum: [{
                        $size: "$albums"
                      }, {
                        $size: "$comments"
                      }]
                    } // Tổng số bình luận và albums
                  }
                },
                // Sắp xếp theo tổng số giảm dần
                {
                  $sort: {
                    totalCount: -1
                  }
                }, {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    photo: 1,
                    totalAlbums: 1,
                    totalComments: 1
                  }
                }]);
              case 3:
                allUsers = _context3.sent;
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: allUsers.length,
                  data: {
                    data: allUsers
                  }
                });
                _context3.next = 11;
                break;
              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                return _context3.abrupt("return", next(new AppError("Server error", 500)));
              case 11:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 7]]);
        }));
        return function (_x7, _x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "findUsersByFields",
    value: function findUsersByFields() {
      var _this4 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res, next) {
          var _req$query, _users$0$metadata$, searchQuery, page, limit, skip, matchConditions, users, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                searchQuery = req.query.searchQuery;
                page = Math.max(req.query.page * 1 || 1, 1); // Ensure page is a positive integer
                limit = Math.max(((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.limit) * 1 || 100, 1); // Ensure limit is a positive integer
                skip = (page - 1) * limit;
                matchConditions = {};
                if (searchQuery && searchQuery.trim() !== "") {
                  matchConditions["$or"] = [{
                    fullname: {
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
                  }];
                }
                _context4.next = 9;
                return _this4.userModel.aggregate([{
                  $match: {
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }].concat(_toConsumableArray(Object.keys(matchConditions).length > 0 ? [{
                  $match: matchConditions
                }] : []), [{
                  $project: {
                    _id: 1,
                    phone: 1,
                    fullname: 1,
                    address: 1,
                    photo: 1,
                    role: 1,
                    email: 1
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
                users = _context4.sent;
                total = ((_users$0$metadata$ = users[0].metadata[0]) === null || _users$0$metadata$ === void 0 ? void 0 : _users$0$metadata$.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = users[0].data;
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
              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4["catch"](0);
                console.error("Error fetching users", _context4.t0);
                return _context4.abrupt("return", next(new AppError("Server error", 500)));
              case 20:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[0, 16]]);
        }));
        return function (_x10, _x11, _x12) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getChatBotResponse",
    value: function getChatBotResponse() {
      return catchAsync(/*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res, next) {
          var response;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return axios.get("http://127.0.0.1:8005/chatbot", {
                  params: {
                    query: query,
                    user_lat: userLat,
                    user_lon: userLon
                  }
                });
              case 3:
                response = _context5.sent;
                console.log("Chatbot response:", response.data);
                return _context5.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  data: {
                    data: response.data
                  }
                }));
              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                console.error("Error calling chatbot API:", _context5.t0);
                return _context5.abrupt("return", new AppError("Không thể nhận dữ liệu từ chatbot.", 500));
              case 12:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 8]]);
        }));
        return function (_x13, _x14, _x15) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "findUsersByRole",
    value: function findUsersByRole() {
      var _this5 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res, next) {
          var userDetails;
          return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return _this5.userModel.aggregate([{
                  $match: {
                    role: "owner"
                  }
                }, {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    address: 1
                  }
                }]);
              case 3:
                userDetails = _context6.sent;
                res.status(200).json({
                  message: "Request has been processed successfully",
                  status: "success",
                  results: userDetails.length,
                  data: userDetails
                });
                _context6.next = 11;
                break;
              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                return _context6.abrupt("return", next(new AppError("Server error", 500)));
              case 11:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[0, 7]]);
        }));
        return function (_x16, _x17, _x18) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default UserRepository;