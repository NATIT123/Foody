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
          var categoryId, features, doc, results;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                categoryId = req.params.categoryId;
                if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                features = new APIFeatures(_this.subCategoryModel.find(), req.query).sort().limitFields().populate();
                _context.next = 6;
                return features.query;
              case 6:
                doc = _context.sent;
                results = doc.filter(function (item) {
                  var _item$categoryId;
                  return ((_item$categoryId = item.categoryId) === null || _item$categoryId === void 0 ? void 0 : _item$categoryId._id.toString()) === categoryId;
                }); // SEND RESPONSE
                if (doc) {
                  _context.next = 10;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 10:
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: results.length,
                  data: {
                    data: results
                  }
                });
              case 11:
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
  }, {
    key: "getSubCategoryByCategorySpecific",
    value: function getSubCategoryByCategorySpecific() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var features, doc, results;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                features = new APIFeatures(_this2.subCategoryModel.find(), req.query).sort().limitFields().populate();
                _context2.next = 3;
                return features.query;
              case 3:
                doc = _context2.sent;
                results = doc.filter(function (item) {
                  var _item$categoryId2;
                  return ((_item$categoryId2 = item.categoryId) === null || _item$categoryId2 === void 0 ? void 0 : _item$categoryId2._id.toString()) === "67654798e6e3bf12235f6174";
                }); // SEND RESPONSE
                if (doc) {
                  _context2.next = 7;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 7:
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: results.length,
                  data: {
                    data: results
                  }
                });
              case 8:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default SubCategoryRepository;