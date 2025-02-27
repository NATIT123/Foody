import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
var DistrictRepository = /*#__PURE__*/function () {
  function DistrictRepository(districtModel) {
    _classCallCheck(this, DistrictRepository);
    this.districtModel = districtModel;
  }
  return _createClass(DistrictRepository, [{
    key: "addDistrict",
    value: function addDistrict() {
      return createOne(this.districtModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.districtModel);
    }
  }, {
    key: "getDistrictById",
    value: function getDistrictById() {
      return getOne(this.districtModel, "districtId");
    }
  }, {
    key: "updateDistrictById",
    value: function updateDistrictById() {
      return updateOne(this.districtModel);
    }
  }, {
    key: "deleteDistrictById",
    value: function deleteDistrictById() {
      return deleteOne(this.districtModel);
    }
  }, {
    key: "getDistrictsByCity",
    value: function getDistrictsByCity() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var cityId, features, doc, results;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                cityId = req.params.cityId;
                if (cityId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 3:
                console.log(cityId);
                features = new APIFeatures(_this.districtModel.find(), req.query).sort().limitFields().populate();
                _context.next = 7;
                return features.query;
              case 7:
                doc = _context.sent;
                results = doc.filter(function (item) {
                  var _item$cityId;
                  return ((_item$cityId = item.cityId) === null || _item$cityId === void 0 ? void 0 : _item$cityId._id.toString()) === cityId.toString();
                });
                res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  results: results.length,
                  data: {
                    data: results
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
export default DistrictRepository;