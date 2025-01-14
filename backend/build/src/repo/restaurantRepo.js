import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
var RestaurantRepository = /*#__PURE__*/function () {
  function RestaurantRepository(restaurantModel, countryModel) {
    _classCallCheck(this, RestaurantRepository);
    this.restaurantModel = restaurantModel;
    this.countryModel = countryModel;
  }
  return _createClass(RestaurantRepository, [{
    key: "addRestaurant",
    value: function addRestaurant() {
      return createOne(this.restaurantModel);
    }
  }, {
    key: "getAllRestaurants",
    value: function getAllRestaurants() {
      return getAll(this.restaurantModel);
    }
  }, {
    key: "getRestaurantById",
    value: function getRestaurantById() {
      return getOne(this.restaurantModel, "districtId");
    }
  }, {
    key: "updateRestaurantById",
    value: function updateRestaurantById() {
      return updateOne(this.restaurantModel);
    }
  }, {
    key: "deleteRestaurantById",
    value: function deleteRestaurantById() {
      return deleteOne(this.restaurantModel);
    }
  }, {
    key: "getByOptions",
    value: function getByOptions() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var cityId, categoryId, features, doc;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                cityId = req.params.cityId;
                categoryId = req.params.categoryId;
                if (!(!cityId.match(/^[0-9a-fA-F]{24}$/) || !categoryId.match(/^[0-9a-fA-F]{24}$/))) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 4:
                features = new APIFeatures(_this.restaurantModel.find(), req.query).sort().limitFields().populate().paginate();
                _context.next = 7;
                return features.query;
              case 7:
                doc = _context.sent;
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
                  _context.next = 11;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
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
    key: "getByCity",
    value: function getByCity() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var cityId, features, doc, results, page, limit, skip;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                cityId = req.params.cityId;
                if (cityId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context2.next = 3;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                features = new APIFeatures(_this2.restaurantModel.find(), req.query).sort().limitFields().populate();
                _context2.next = 6;
                return features.query;
              case 6:
                doc = _context2.sent;
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
                  _context2.next = 15;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
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
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getTopDeals",
    value: function getTopDeals() {
      var _this3 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
          var cityId, features, doc;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                cityId = req.params.cityId; // Kiểm tra tính hợp lệ của cityId
                if (cityId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context3.next = 3;
                  break;
                }
                return _context3.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                // Tạo query với aggregation
                features = new APIFeatures(_this3.restaurantModel.aggregate([{
                  $addFields: {
                    averageSales: {
                      $avg: ["$qualityRate", "$serviceRate", "$locationRate", "$priceRate", "$serviceRate"]
                    }
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    // Tên collection district
                    localField: "districtId",
                    // Trường trong collection restaurant
                    foreignField: "_id",
                    // Trường trong collection district
                    as: "district" // Kết quả join sẽ có trường "district"
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    // Tên collection subcategory
                    localField: "subCategoryId",
                    // Trường trong collection restaurant
                    foreignField: "_id",
                    // Trường trong collection subcategory
                    as: "subcategory" // Kết quả join sẽ có trường "subcategory"
                  }
                }, {
                  $sort: {
                    averageSales: -1,
                    createdAt: -1
                  } // Sắp xếp theo averageSales và createdAt
                }, {
                  $match: {
                    "district.cityId": new mongoose.Types.ObjectId(cityId)
                  }
                }, {
                  $limit: parseInt(req.query.limit) || 5 // Lấy 5 bản ghi đầu tiên
                }]), req.query).limitFields(); // Thực hiện truy vấn
                _context3.next = 6;
                return features.query;
              case 6:
                doc = _context3.sent;
                if (!(!doc || doc.length === 0)) {
                  _context3.next = 9;
                  break;
                }
                return _context3.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
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
                return _context3.stop();
            }
          }, _callee3);
        }));
        return function (_x7, _x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getRestaurantByFields",
    value: function getRestaurantByFields() {
      var _this4 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res, next) {
          var cityId, search, features, doc;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                cityId = req.params.cityId;
                search = req.query.search || "";
                console.log(search);
                // Kiểm tra tính hợp lệ của cityId
                if (cityId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context4.next = 5;
                  break;
                }
                return _context4.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 5:
                // Tạo query với aggregation
                features = new APIFeatures(_this4.restaurantModel.aggregate([{
                  $addFields: {
                    averageSales: {
                      $avg: ["$qualityRate", "$serviceRate", "$locationRate", "$priceRate", "$serviceRate"]
                    }
                  }
                }, {
                  $lookup: {
                    from: "districts",
                    // Tên collection district
                    localField: "districtId",
                    // Trường trong collection restaurant
                    foreignField: "_id",
                    // Trường trong collection district
                    as: "district" // Kết quả join sẽ có trường "district"
                  }
                }, {
                  $lookup: {
                    from: "subcategories",
                    // Tên collection subcategory
                    localField: "subCategoryId",
                    // Trường trong collection restaurant
                    foreignField: "_id",
                    // Trường trong collection subcategory
                    as: "subcategory" // Kết quả join sẽ có trường "subcategory"
                  }
                }, {
                  $sort: {
                    averageSales: -1,
                    createdAt: -1
                  } // Sắp xếp theo averageSales và createdAt
                }, {
                  $match: {
                    "district.cityId": new mongoose.Types.ObjectId(cityId)
                  }
                }, {
                  $limit: 10 // Lấy 10 bản ghi đầu tiên
                }, {
                  $match: {
                    $or: [{
                      name: {
                        $regex: search,
                        $options: "i"
                      }
                    }, {
                      address: {
                        $regex: search,
                        $options: "i"
                      }
                    }, {
                      cuisines: {
                        $regex: search,
                        $options: "i"
                      }
                    }]
                  }
                }]), req.query).limitFields(); // Thực hiện truy vấn
                _context4.next = 8;
                return features.query;
              case 8:
                doc = _context4.sent;
                if (!(!doc || doc.length === 0)) {
                  _context4.next = 11;
                  break;
                }
                return _context4.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
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
                return _context4.stop();
            }
          }, _callee4);
        }));
        return function (_x10, _x11, _x12) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default RestaurantRepository;