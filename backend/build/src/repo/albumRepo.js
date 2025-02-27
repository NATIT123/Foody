import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll, getOne, updateOne, deleteOne } from "../controllers/handleFactory.js";
import customResourceResponse from "../utils/constant.js";
import { v2 as cloudinary } from "cloudinary";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
var AlbumRepository = /*#__PURE__*/function () {
  function AlbumRepository(albumModel) {
    _classCallCheck(this, AlbumRepository);
    this.albumModel = albumModel;
  }
  return _createClass(AlbumRepository, [{
    key: "addAlbum",
    value: function addAlbum() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var _req$body, restaurantId, userId, uploadStream, imageUrl;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, restaurantId = _req$body.restaurantId, userId = _req$body.userId;
                if (!(!restaurantId.match(/^[0-9a-fA-F]{24}$/) || !userId.match(/^[0-9a-fA-F]{24}$/))) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 4:
                cloudinary.config({
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY,
                  api_secret: process.env.CLOUDINARY_API_SECRET
                });
                uploadStream = function uploadStream() {
                  return new Promise(function (resolve, reject) {
                    var stream = cloudinary.uploader.upload_stream({
                      folder: "albums"
                    }, function (error, result) {
                      if (error) return reject(new AppError("Upload failed!", 500));
                      resolve(result.secure_url);
                    });
                    stream.end(req.file.buffer);
                  });
                };
                _context.next = 8;
                return uploadStream();
              case 8:
                imageUrl = _context.sent;
                _context.next = 11;
                return _this.albumModel.create({
                  image: imageUrl,
                  userId: userId,
                  restaurantId: restaurantId
                });
              case 11:
                res.status(customResourceResponse.success.statusCode).json({
                  message: "Upload thành công!",
                  status: "success",
                  data: {
                    photo: imageUrl
                  }
                });
                _context.next = 18;
                break;
              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                return _context.abrupt("return", next(new AppError("Something went wrong!", 500)));
              case 18:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 14]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getAllAlbums",
    value: function getAllAlbums() {
      return getAll(this.albumModel);
    }
  }, {
    key: "getAlbumById",
    value: function getAlbumById() {
      return getOne(this.albumModel, "restaurantId");
    }
  }, {
    key: "updateAlbumById",
    value: function updateAlbumById() {
      return updateOne(this.albumModel);
    }
  }, {
    key: "deleteAlbumById",
    value: function deleteAlbumById() {
      return deleteOne(this.albumModel);
    }
  }, {
    key: "getAlbumsByRestaurant",
    value: function getAlbumsByRestaurant() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var restaurantId, doc, filteredDoc;
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
                return _this2.albumModel.find({
                  restaurantId: restaurantId
                }).select("image");
              case 5:
                doc = _context2.sent;
                // SEND RESPONSE
                filteredDoc = doc.filter(function (album) {
                  return !album.image.startsWith("data:image");
                });
                if (filteredDoc.length) {
                  _context2.next = 9;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 9:
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: filteredDoc.length,
                  data: {
                    data: filteredDoc
                  }
                });
              case 10:
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
export default AlbumRepository;