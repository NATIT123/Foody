import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var AuthService = /*#__PURE__*/function () {
  function AuthService(authRepo) {
    var _this = this;
    _classCallCheck(this, AuthService);
    _defineProperty(this, "restrictTo", function () {
      var _this$authRepo;
      return (_this$authRepo = _this.authRepo).restrictTo.apply(_this$authRepo, arguments);
    });
    this.authRepo = authRepo;
  }
  return _createClass(AuthService, [{
    key: "protect",
    value: function protect() {
      return this.authRepo.protect();
    }
  }, {
    key: "login",
    value: function login() {
      return this.authRepo.login();
    }
  }, {
    key: "signUp",
    value: function signUp() {
      return this.authRepo.signUp();
    }
  }, {
    key: "logOut",
    value: function logOut() {
      return this.authRepo.logOut();
    }
  }, {
    key: "forgotPassword",
    value: function forgotPassword() {
      return this.authRepo.forgotPassword();
    }
  }, {
    key: "resetPassword",
    value: function resetPassword() {
      return this.authRepo.resetPassword();
    }
  }, {
    key: "changePassword",
    value: function changePassword() {
      return this.authRepo.changePassword();
    }
  }, {
    key: "getMe",
    value: function getMe() {
      return this.authRepo.getMe();
    }
  }, {
    key: "deleteMe",
    value: function deleteMe() {
      return this.authRepo.deleteMe();
    }
  }, {
    key: "updateMe",
    value: function updateMe() {
      return this.authRepo.updateMe();
    }
  }, {
    key: "processNewToken",
    value: function processNewToken() {
      return this.authRepo.processNewToken();
    }
  }, {
    key: "checkPassword",
    value: function checkPassword() {
      return this.authRepo.checkPassword();
    }
  }]);
}();
export default AuthService;