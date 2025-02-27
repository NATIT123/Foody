import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
var NotificationRepository = /*#__PURE__*/function () {
  function NotificationRepository(notificationModel) {
    _classCallCheck(this, NotificationRepository);
    this.notificationModel = notificationModel;
  }
  return _createClass(NotificationRepository, [{
    key: "addNotification",
    value: function addNotification() {
      return createOne(this.notificationModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.notificationModel);
    }
  }, {
    key: "getNotificationById",
    value: function getNotificationById() {
      return getOne(this.notificationModel);
    }
  }, {
    key: "updateNotificationById",
    value: function updateNotificationById() {
      return updateOne(this.notificationModel);
    }
  }, {
    key: "deleteNotificationById",
    value: function deleteNotificationById() {
      return deleteOne(this.notificationModel);
    }
  }, {
    key: "makeAllIsRead",
    value: function makeAllIsRead() {
      var _this = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
          var userId;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                userId = req.params.userId;
                if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 4:
                _context.next = 6;
                return _this.notificationModel.updateMany({
                  userId: userId,
                  isRead: false
                }, {
                  $set: {
                    isRead: true
                  }
                });
              case 6:
                return _context.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success"
                }));
              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                return _context.abrupt("return", next(new AppError("Server error", 500)));
              case 13:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[0, 9]]);
        }));
        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getNotificationsByUserId",
    value: function getNotificationsByUserId() {
      var _this2 = this;
      return catchAsync(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
          var userId, notifications;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                userId = req.params.userId;
                if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                  _context2.next = 4;
                  break;
                }
                return _context2.abrupt("return", next(new AppError(customResourceResponse.notValidId.message, customResourceResponse.notValidId.statusCode)));
              case 4:
                _context2.next = 6;
                return _this2.notificationModel.find({
                  userId: userId
                });
              case 6:
                notifications = _context2.sent;
                return _context2.abrupt("return", res.status(customResourceResponse.success.statusCode).json({
                  message: customResourceResponse.success.message,
                  status: "success",
                  data: {
                    data: notifications
                  }
                }));
              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                return _context2.abrupt("return", next(new AppError("Server error", 500)));
              case 14:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[0, 10]]);
        }));
        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }]);
}();
export default NotificationRepository;