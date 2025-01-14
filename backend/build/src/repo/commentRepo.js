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
      return createOne(this.commentModel);
    }
  }, {
    key: "getAllComments",
    value: function getAllComments() {
      return getAll(this.commentModel, "userId,restaurantId");
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
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var restaurantId, features, doc;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                restaurantId = req.params.restaurantId; // Kiểm tra tính hợp lệ của cityId
                if (restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                // Tạo query với aggregation
                features = new APIFeatures(_this.commentModel.aggregate([{
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
                }]), req.query).limitFields(); // Thực hiện truy vấn
                _context.next = 6;
                return features.query;
              case 6:
                doc = _context.sent;
                if (!(!doc || doc.length === 0)) {
                  _context.next = 9;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 9:
                // Gửi phản hồi
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: doc.length,
                  data: {
                    data: doc
                  }
                });
              case 10:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default CommentRepository;