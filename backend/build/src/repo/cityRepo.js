import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
var CityRepository = /*#__PURE__*/function () {
  function CityRepository(cityModel) {
    _classCallCheck(this, CityRepository);
    this.cityModel = cityModel;
  }
  return _createClass(CityRepository, [{
    key: "addCity",
    value: function addCity() {
      return createOne(this.cityModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var cities;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _this.cityModel.aggregate([{
                  $match: {
                    countryId: new mongoose.Types.ObjectId("675e78747e954370b5142b0e")
                  }
                }]);
              case 3:
                cities = _context.sent;
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: cities.length,
                  data: {
                    data: cities
                  }
                });
                _context.next = 10;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
              case 10:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 7]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getCityById",
    value: function getCityById() {
      return getOne(this.cityModel, "CountryId");
    }
  }, {
    key: "updateCityById",
    value: function updateCityById() {
      return updateOne(this.cityModel);
    }
  }, {
    key: "deleteCityById",
    value: function deleteCityById() {
      return deleteOne(this.cityModel);
    }
  }]);
}();
export default CityRepository;