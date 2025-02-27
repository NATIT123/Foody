import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var CuisinesService = /*#__PURE__*/function () {
  function CuisinesService(cuisinesRepo) {
    _classCallCheck(this, CuisinesService);
    this.cuisinesRepo = cuisinesRepo;
  }
  return _createClass(CuisinesService, [{
    key: "addCuisines",
    value: function addCuisines() {
      return this.cuisinesRepo.addCuisines();
    }
  }, {
    key: "getAllCuisines",
    value: function getAllCuisines() {
      return this.cuisinesRepo.getAll();
    }
  }, {
    key: "getCuisinesById",
    value: function getCuisinesById() {
      return this.cuisinesRepo.getCuisinesById();
    }
  }, {
    key: "updateCuisinesById",
    value: function updateCuisinesById() {
      return this.cuisinesRepo.updateCuisinesById();
    }
  }, {
    key: "deleteCuisinesById",
    value: function deleteCuisinesById() {
      return this.cuisinesRepo.deleteCuisinesById();
    }
  }]);
}();
export default CuisinesService;