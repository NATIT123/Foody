import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var CuisinesRepository = /*#__PURE__*/function () {
  function CuisinesRepository(cuisinesModel) {
    _classCallCheck(this, CuisinesRepository);
    this.cuisinesModel = cuisinesModel;
  }
  return _createClass(CuisinesRepository, [{
    key: "addCuisines",
    value: function addCuisines() {
      return createOne(this.CuisinesModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.cuisinesModel);
    }
  }, {
    key: "getCuisinesById",
    value: function getCuisinesById() {
      return getOne(this.cuisinesModel);
    }
  }, {
    key: "updateCuisinesById",
    value: function updateCuisinesById() {
      return updateOne(this.cuisinesModel);
    }
  }, {
    key: "deleteCuisinesById",
    value: function deleteCuisinesById() {
      return deleteOne(this.cuisinesModel);
    }
  }]);
}();
export default CuisinesRepository;