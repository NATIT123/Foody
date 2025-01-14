import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var UserRepository = /*#__PURE__*/function () {
  function UserRepository(userModel) {
    _classCallCheck(this, UserRepository);
    this.userModel = userModel;
  }
  return _createClass(UserRepository, [{
    key: "addUser",
    value: function addUser() {
      return createOne(this.userModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.userModel);
    }
  }, {
    key: "getUserById",
    value: function getUserById() {
      return getOne(this.userModel);
    }
  }, {
    key: "updateUserById",
    value: function updateUserById() {
      return updateOne(this.userModel);
    }
  }, {
    key: "deleteUserById",
    value: function deleteUserById() {
      return deleteOne(this.userModel);
    }
  }]);
}();
export default UserRepository;