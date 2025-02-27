import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import customResourceResponse from "../utils/constant.js";
import catchAsync from "../utils/catchAsync.js";
import { v2 as cloudinary } from "cloudinary";
var FoodRepository = /*#__PURE__*/function () {
  function FoodRepository(foodModel) {
    _classCallCheck(this, FoodRepository);
    this.foodModel = foodModel;
  }
  return _createClass(FoodRepository, [{
    key: "addFood",
    value: function addFood() {
      return createOne(this.foodModel);
    }
  }, {
    key: "getAllFoods",
    value: function getAllFoods() {
      return getAll(this.foodModel, "restaurantId");
    }
  }, {
    key: "getFoodById",
    value: function getFoodById() {
      return getOne(this.foodModel);
    }
  }, {
    key: "updateFoodById",
    value: function updateFoodById() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var id, _req$body, name, priceOriginal, priceDiscount, food, imageUrl, uploadStream;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                id = req.params.id;
                _req$body = req.body, name = _req$body.name, priceOriginal = _req$body.priceOriginal, priceDiscount = _req$body.priceDiscount; // Kiểm tra ID hợp lệ
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                  _context.next = 5;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 5:
                _context.next = 7;
                return _this.foodModel.findById(id);
              case 7:
                food = _context.sent;
                if (food) {
                  _context.next = 10;
                  break;
                }
                return _context.abrupt("return", next(new AppError("Food not found!", 404)));
              case 10:
                // Nếu có ảnh mới, upload lên Cloudinary
                imageUrl = food.image; // Giữ ảnh cũ mặc định
                if (!req.file) {
                  _context.next = 17;
                  break;
                }
                cloudinary.config({
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY,
                  api_secret: process.env.CLOUDINARY_API_SECRET
                });
                uploadStream = function uploadStream() {
                  return new Promise(function (resolve, reject) {
                    var stream = cloudinary.uploader.upload_stream({
                      folder: "foods"
                    },
                    // Lưu ảnh vào thư mục "foods" trên Cloudinary
                    function (error, result) {
                      if (error) return reject(new AppError("Upload failed!", 500));
                      resolve(result.secure_url);
                    });
                    stream.end(req.file.buffer);
                  });
                };
                _context.next = 16;
                return uploadStream();
              case 16:
                imageUrl = _context.sent;
              case 17:
                _context.next = 19;
                return _this.foodModel.findByIdAndUpdate(id, {
                  name: name,
                  priceOriginal: priceOriginal,
                  priceDiscount: priceDiscount,
                  image: imageUrl
                }, {
                  "new": true,
                  runValidators: true
                });
              case 19:
                food = _context.sent;
                res.status(customResourceResponse.success.statusCode).json({
                  message: "Cập nhật món ăn thành công!",
                  status: "success",
                  data: {
                    food: food
                  }
                });
                _context.next = 27;
                break;
              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                return _context.abrupt("return", next(new AppError("Something went wrong!", 500)));
              case 27:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 23]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "deleteFoodById",
    value: function deleteFoodById() {
      return deleteOne(this.foodModel);
    }
  }, {
    key: "getFoodSByRestaurant",
    value: function getFoodSByRestaurant() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var restaurantId, doc;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                restaurantId = req.params.restaurantId;
                if (restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context2.next = 3;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                _context2.next = 5;
                return _this2.foodModel.find({
                  restaurantId: restaurantId
                });
              case 5:
                doc = _context2.sent;
                if (doc) {
                  _context2.next = 8;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 8:
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: doc.length,
                  data: {
                    data: doc
                  }
                });
              case 9:
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
export default FoodRepository;