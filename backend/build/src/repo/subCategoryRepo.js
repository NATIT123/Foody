import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";
var SubCategoryRepository = /*#__PURE__*/function () {
  function SubCategoryRepository(subCategoryModel, categoryModel) {
    _classCallCheck(this, SubCategoryRepository);
    this.categoryModel = categoryModel;
    this.subCategoryModel = subCategoryModel;
  }
  return _createClass(SubCategoryRepository, [{
    key: "addsubCategory",
    value: function addsubCategory() {
      return createOne(this.subCategoryModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.subCategoryModel);
    }
  }, {
    key: "getsubCategoryById",
    value: function getsubCategoryById() {
      return getOne(this.subCategoryModel, "categoryId");
    }
  }, {
    key: "updatesubCategoryById",
    value: function updatesubCategoryById() {
      return updateOne(this.subCategoryModel);
    }
  }, {
    key: "deletesubCategoryById",
    value: function deletesubCategoryById() {
      return deleteOne(this.subCategoryModel);
    }
  }, {
    key: "getSubCategoryByCategory",
    value: function getSubCategoryByCategory() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var category, features, doc;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.categoryModel.findOne({
                  name: "Ăn uống"
                });
              case 2:
                category = _context.sent;
                if (category) {
                  _context.next = 5;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 5:
                // Tạo query với aggregation
                features = new APIFeatures(_this.subCategoryModel.aggregate([{
                  $match: {
                    categoryId: new mongoose.Types.ObjectId(category._id)
                  } // Lọc theo categoryId
                }, {
                  $sort: {
                    createdAt: 1
                  } // Sắp xếp theo createdAt tăng dần
                }]), req.query).limitFields(); // Thực hiện truy vấn
                _context.next = 8;
                return features.query;
              case 8:
                doc = _context.sent;
                if (!(!doc || doc.length === 0)) {
                  _context.next = 11;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 11:
                // Gửi phản hồi
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: doc.length,
                  data: {
                    data: doc
                  }
                });
              case 12:
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
export default SubCategoryRepository;