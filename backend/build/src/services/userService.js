import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var UserService = /*#__PURE__*/function () {
  function UserService(userRepo) {
    _classCallCheck(this, UserService);
    this.userRepo = userRepo;
  }
  return _createClass(UserService, [{
    key: "addUser",
    value: function addUser() {
      return this.userRepo.addUser();
    }
  }, {
    key: "getAllUsers",
    value: function getAllUsers() {
      return this.userRepo.getAll();
    }
  }, {
    key: "getUserById",
    value: function getUserById() {
      return this.userRepo.getUserById();
    }
  }, {
    key: "updateUserById",
    value: function updateUserById() {
      return this.userRepo.updateUserById();
    }
  }, {
    key: "deleteUserById",
    value: function deleteUserById() {
      return this.userRepo.deleteUserById();
    }
  }, {
    key: "getMe",
    value: function getMe() {
      return this.userRepo.getMe();
    }
  }, {
    key: "uploadPhoto",
    value: function uploadPhoto() {
      return this.userRepo.uploadPhoto();
    }
  }, {
    key: "getUsersDetail",
    value: function getUsersDetail() {
      return this.userRepo.getUserDetails();
    }
  }, {
    key: "getAllDetails",
    value: function getAllDetails() {
      return this.userRepo.getAllDetails();
    }
  }, {
    key: "findUsersByFields",
    value: function findUsersByFields() {
      return this.userRepo.findUsersByFields();
    }
  }, {
    key: "getChatBotResponse",
    value: function getChatBotResponse() {
      return this.userRepo.getChatBotResponse();
    }
  }, {
    key: "findUsersByRole",
    value: function findUsersByRole() {
      return this.userRepo.findUsersByRole();
    }
  }]);
}();
export default UserService;