import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { filterObj, createSendToken, updateUserToken } from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";
import Email from "../utils/email.js";
var AuthRepository = /*#__PURE__*/_createClass(function AuthRepository(userModel) {
  var _this = this;
  _classCallCheck(this, AuthRepository);
  _defineProperty(this, "logOut", function () {
    return updateUserToken(_this.userModel, "");
  });
  _defineProperty(this, "signUp", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res, next) {
        var newUser, url;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.userModel.create(req.body);
            case 2:
              newUser = _context.sent;
              url = "".concat(req.protocol, "://").concat(req.get("host"), "/me");
              _context.next = 6;
              return new Email(newUser, url).sendWelcome();
            case 6:
              createSendToken(_this.userModel, newUser, 201, res);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "login", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res, next) {
        var _req$body, email, password, user;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _req$body = req.body, email = _req$body.email, password = _req$body.password; // 1) Check if email and password exist
              if (!(!email || !password)) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return", next(new AppError("Please provide email and password!", 400)));
            case 3:
              _context2.next = 5;
              return _this.userModel.findOne({
                email: email
              }).select("+password");
            case 5:
              user = _context2.sent;
              if (user) {
                _context2.next = 8;
                break;
              }
              return _context2.abrupt("return", next(new AppError("User Not Found", 404)));
            case 8:
              _context2.t0 = console;
              _context2.next = 11;
              return user.correctPassword(password, user.password);
            case 11:
              _context2.t1 = _context2.sent;
              _context2.t0.log.call(_context2.t0, _context2.t1);
              _context2.t2 = !user;
              if (_context2.t2) {
                _context2.next = 18;
                break;
              }
              _context2.next = 17;
              return user.correctPassword(password, user.password);
            case 17:
              _context2.t2 = !_context2.sent;
            case 18:
              if (!_context2.t2) {
                _context2.next = 20;
                break;
              }
              return _context2.abrupt("return", next(new AppError("Incorrect email or password", 401)));
            case 20:
              // 3) If everything ok, send token to client
              createSendToken(_this.userModel, user, 200, res);
            case 21:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "protect", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res, next) {
        var token, decoded, freshUser;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              /////Getting token and check of it's there

              if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
              } else if (req.cookies.refreshToken) {
                token = req.cookies.refreshToken;
              }
              if (token) {
                _context3.next = 3;
                break;
              }
              return _context3.abrupt("return", next(new AppError("You are not logged in! Please log in to get access", 401)));
            case 3:
              _context3.next = 5;
              return promisify(jwt.verify)(token, process.env.JWT_SECERT);
            case 5:
              decoded = _context3.sent;
              _context3.next = 8;
              return _this.userModel.findById(decoded.id);
            case 8:
              freshUser = _context3.sent;
              if (freshUser) {
                _context3.next = 11;
                break;
              }
              return _context3.abrupt("return", next(new AppError("The user beloging to this token does no longer exist", 401)));
            case 11:
              if (!freshUser.changePasswordAfter(decoded.iat)) {
                _context3.next = 13;
                break;
              }
              return _context3.abrupt("return", next(new AppError("User recently changed password!", 401)));
            case 13:
              ///Grant access to protected route
              req.user = freshUser;
              res.locals.user = freshUser;
              next();
            case 16:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function (_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "restrictTo", function () {
    for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
      roles[_key] = arguments[_key];
    }
    return catchAsync(function (req, res, next) {
      if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to perform this action", 403));
      }
      next();
    });
  });
  _defineProperty(this, "forgotPassword", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res, next) {
        var user, resetToken, resetURL;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (req.body.email) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", next(new AppError("Please input your email", 404)));
            case 2:
              _context4.next = 4;
              return _this.userModel.findOne({
                email: req.body.email
              });
            case 4:
              user = _context4.sent;
              if (user) {
                _context4.next = 7;
                break;
              }
              return _context4.abrupt("return", next(new AppError("There is no user with email address", 404)));
            case 7:
              //Generate the random reset token
              resetToken = user.createPasswordResetToken();
              _context4.next = 10;
              return user.save({
                validateBeforeSave: false
              });
            case 10:
              _context4.prev = 10;
              resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/user/resetPassword/").concat(resetToken);
              _context4.next = 14;
              return new Email(user, resetURL).sendPasswordReset();
            case 14:
              res.status(200).json({
                status: "success",
                message: "Token sent to email"
              });
              _context4.next = 25;
              break;
            case 17:
              _context4.prev = 17;
              _context4.t0 = _context4["catch"](10);
              console.log(_context4.t0.message);
              user.passwordResetToken = undefined;
              user.passwordResetExpires = undefined;
              _context4.next = 24;
              return user.save({
                validateBeforeSave: false
              });
            case 24:
              return _context4.abrupt("return", next(new AppError("There was an error sending the email. Try again later!", 500)));
            case 25:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[10, 17]]);
      }));
      return function (_x10, _x11, _x12) {
        return _ref4.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "resetPassword", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res, next) {
        var hashedToken, user;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              ///Get user based on the token
              hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
              _context5.next = 3;
              return _this.userModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                  $gt: Date.now()
                }
              });
            case 3:
              user = _context5.sent;
              if (user) {
                _context5.next = 6;
                break;
              }
              return _context5.abrupt("return", next(new AppError("Token is invalid or has expeired", 400)));
            case 6:
              user.password = req.body.password;
              user.confirmPassword = req.body.confirmPassword;
              user.passwordResetToken = undefined;
              user.passwordResetExpires = undefined;
              _context5.next = 12;
              return user.save({
                validateBeforeSave: true
              });
            case 12:
              //update changePasswordAt property for the user

              ///Log the user in, send JWT
              user.password = undefined;
              createSendToken(_this.userModel, user, 201, res);
            case 14:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function (_x13, _x14, _x15) {
        return _ref5.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "changePassword", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res, next) {
        var user, correct;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _this.userModel.findById(req.params.id).select("+password");
            case 2:
              user = _context6.sent;
              if (user) {
                _context6.next = 5;
                break;
              }
              return _context6.abrupt("return", next(new AppError(customResourceResponse.recordNotFound.message, customResourceResponse.recordNotFound.statusCode)));
            case 5:
              _context6.next = 7;
              return user.correctPassword(req.body.password, user.password);
            case 7:
              correct = _context6.sent;
              if (correct) {
                _context6.next = 10;
                break;
              }
              return _context6.abrupt("return", next(new AppError("Your current password is wrong", 401)));
            case 10:
              ///If so, update password
              user.password = req.body.newPassword;
              user.confirmPassword = req.body.confirmPassword;
              _context6.next = 14;
              return user.save();
            case 14:
              ////Log user in,send JWT
              createSendToken(_this.userModel, user, 201, res);
            case 15:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      return function (_x16, _x17, _x18) {
        return _ref6.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "updateMe", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee7(req, res, next) {
        var filterBody, updateUser;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              if (!(req.body.password || req.body.confirmPassword)) {
                _context7.next = 2;
                break;
              }
              return _context7.abrupt("return", next(new AppError("This route is not for password updates. Please use /changePassword.", 400)));
            case 2:
              ///Update user document
              ///Filter out unwanted fields names that are not allowed to be updated
              filterBody = filterObj(req.body, "fullName", "address");
              _context7.next = 5;
              return _this.userModel.findByIdAndUpdate(req.params.id, filterBody, {
                "new": true,
                runValidators: true
              });
            case 5:
              updateUser = _context7.sent;
              res.status(customResourceResponse.success.statusCode).json({
                message: customResourceResponse.success.message,
                status: "success",
                data: updateUser._id
              });
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      return function (_x19, _x20, _x21) {
        return _ref7.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "processNewToken", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee8(req, res) {
        var refreshToken, user;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              refreshToken = req.cookies.refreshToken;
              jwt.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_TOKEN_SECRET
              });
              _context8.next = 5;
              return _this.findUserByToken(refreshToken);
            case 5:
              user = _context8.sent;
              if (!user) {
                _context8.next = 10;
                break;
              }
              createSendToken(user, 201, res);
              _context8.next = 11;
              break;
            case 10:
              return _context8.abrupt("return", next(AppError(customResourceResponse.jwtNotValid.message, customResourceResponse.jwtNotValid.statusCode)));
            case 11:
              _context8.next = 16;
              break;
            case 13:
              _context8.prev = 13;
              _context8.t0 = _context8["catch"](0);
              return _context8.abrupt("return", next(AppError("Refresh token is not valid.Please sign in again", 500)));
            case 16:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[0, 13]]);
      }));
      return function (_x22, _x23) {
        return _ref8.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "findUserByToken", /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee9(refreshToken) {
      return _regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _this.userModel.findOne({
              refreshToken: refreshToken
            });
          case 2:
            return _context9.abrupt("return", _context9.sent);
          case 3:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return function (_x24) {
      return _ref9.apply(this, arguments);
    };
  }());
  _defineProperty(this, "deleteMe", function () {
    return catchAsync(/*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee10(req, res, next) {
        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _this.userModel.findByIdAndUpdate(req.params.id, {
                active: false
              });
            case 2:
              res.status(customResourceResponse.success.statusCode).json({
                message: customResourceResponse.success.message,
                status: "success",
                data: null
              });
            case 3:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      return function (_x25, _x26, _x27) {
        return _ref10.apply(this, arguments);
      };
    }());
  });
  _defineProperty(this, "getMe", function () {
    return function (req, res, next) {
      req.params.id = req.user.id;
      next();
    };
  });
  this.userModel = userModel;
});
export default AuthRepository;