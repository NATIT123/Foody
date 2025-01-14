import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var AppError = /*#__PURE__*/function (_Error) {
  function AppError(message, statusCode) {
    var _this;
    _classCallCheck(this, AppError);
    _this = _callSuper(this, AppError, [message]);
    _this.statusCode = statusCode;
    _this.status = "".concat(statusCode).startsWith("4") ? "fail" : "error";
    _this.isOperational = true;
    Error.captureStackTrace(_this, _this.constructor);
    return _this;
  }
  _inherits(AppError, _Error);
  return _createClass(AppError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
export default AppError;