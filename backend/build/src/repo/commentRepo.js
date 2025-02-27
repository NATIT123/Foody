import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
var CommentRepository = /*#__PURE__*/function () {
  function CommentRepository(commentModel) {
    _classCallCheck(this, CommentRepository);
    this.commentModel = commentModel;
  }
  return _createClass(CommentRepository, [{
    key: "addComment",
    value: function addComment() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var _req$params, userId, restaurantId, _req$body, title, description, rate, time, newComment, savedComment;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$params = req.params, userId = _req$params.userId, restaurantId = _req$params.restaurantId;
                _req$body = req.body, title = _req$body.title, description = _req$body.description, rate = _req$body.rate, time = _req$body.time; // Kiểm tra tính hợp lệ của cityId
                if (!(!userId.match(/^[0-9a-fA-F]{24}$/) || !restaurantId.match(/^[0-9a-fA-F]{24}$/))) {
                  _context.next = 5;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 5:
                newComment = {
                  title: title,
                  description: description,
                  time: time,
                  rate: rate,
                  userId: userId,
                  restaurantId: restaurantId
                };
                _context.next = 8;
                return _this.commentModel.create(newComment);
              case 8:
                savedComment = _context.sent;
                console.log(savedComment);
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  data: {
                    data: savedComment._id.toString()
                  }
                });
                _context.next = 17;
                break;
              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                return _context.abrupt("return", next(new AppError("Server Error", 500)));
              case 17:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 13]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getAllComments",
    value: function getAllComments() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var _req$query, _comments$, _comments$2, page, limit, skip, comments, total, totalPages, docs;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                page = req.query.page * 1 || 1;
                limit = ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.limit) * 1 || 100;
                skip = (page - 1) * limit;
                _context2.next = 6;
                return _this2.commentModel.aggregate([{
                  $match: {
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
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
                  $lookup: {
                    from: "albums",
                    "let": {
                      restaurantId: "$restaurantId"
                    },
                    pipeline: [{
                      $match: {
                        $expr: {
                          $eq: ["$restaurantId", "$$restaurantId"]
                        },
                        image: {
                          $not: {
                            $regex: "^data:image"
                          }
                        } // Exclude base64 images
                      }
                    }, {
                      $sort: {
                        createdAt: -1
                      }
                    },
                    // Get latest images
                    {
                      $limit: 5
                    },
                    // Get only 5 images
                    {
                      $project: {
                        _id: 1,
                        image: 1
                      }
                    } // Select required fields
                    ],
                    as: "restaurant.albums"
                  }
                }, {
                  $addFields: {
                    albumCount: {
                      $size: "$restaurant.albums"
                    }
                  }
                }, {
                  $project: {
                    "user._id": 1,
                    "user.fullname": 1,
                    "user.photo": 1,
                    "restaurant.name": 1,
                    "restaurant.address": 1,
                    "restaurant.image": 1,
                    "restaurant.albums": 1,
                    "restaurant._id": 1,
                    rate: 1,
                    description: 1,
                    time: 1,
                    title: 1,
                    type: 1
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
              case 6:
                comments = _context2.sent;
                total = ((_comments$ = comments[0]) === null || _comments$ === void 0 || (_comments$ = _comments$.metadata[0]) === null || _comments$ === void 0 ? void 0 : _comments$.total) || 0;
                totalPages = Math.ceil(total / limit);
                docs = ((_comments$2 = comments[0]) === null || _comments$2 === void 0 ? void 0 : _comments$2.data) || [];
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
              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](0);
                console.error("Error fetching comments", _context2.t0);
                return _context2.abrupt("return", next(new AppError("Server error", 500)));
              case 17:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 13]]);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getCommentById",
    value: function getCommentById() {
      return getOne(this.commentModel);
    }
  }, {
    key: "updateCommentById",
    value: function updateCommentById() {
      return updateOne(this.commentModel);
    }
  }, {
    key: "deleteCommentById",
    value: function deleteCommentById() {
      return deleteOne(this.commentModel);
    }
  }, {
    key: "getCommentsByRestaurant",
    value: function getCommentsByRestaurant() {
      var _this3 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
          var restaurantId, features, doc;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                restaurantId = req.params.restaurantId; // Kiểm tra tính hợp lệ của restaurantId
                if (restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context3.next = 3;
                  break;
                }
                return _context3.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                // Tạo query với aggregation
                features = new APIFeatures(_this3.commentModel.aggregate([{
                  $lookup: {
                    from: "restaurants",
                    // Tên collection district
                    localField: "restaurantId",
                    // Trường trong collection restaurant
                    foreignField: "_id",
                    // Trường trong collection district
                    as: "restaurant" // Kết quả join sẽ có trường "district"
                  }
                }, {
                  $lookup: {
                    from: "users",
                    // Tên collection subcategory
                    localField: "userId",
                    // Trường trong collection restaurant
                    foreignField: "_id",
                    // Trường trong collection subcategory
                    as: "user" // Kết quả join sẽ có trường "subcategory"
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  } // Sắp xếp theo averageSales và createdAt
                }, {
                  $match: {
                    "restaurant._id": new mongoose.Types.ObjectId(restaurantId)
                  }
                }, {
                  $limit: 10 // Lấy 10 bản ghi đầu tiên
                }, {
                  $project: {
                    userId: 1,
                    time: 1,
                    rate: 1,
                    title: 1,
                    description: 1,
                    type: 1,
                    "user._id": 1,
                    "user.fullname": 1,
                    "user.photo": 1
                  }
                }]), req.query).limitFields(); // Thực hiện truy vấn
                _context3.next = 6;
                return features.query;
              case 6:
                doc = _context3.sent;
                // Gửi phản hồi
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: doc.length,
                  data: {
                    data: doc
                  }
                });
              case 8:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        return function (_x7, _x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default CommentRepository;