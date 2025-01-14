import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import customResourceResponse from "../utils/constant.js";
var FoodService = /*#__PURE__*/function () {
  function FoodService(foodRepo) {
    _classCallCheck(this, FoodService);
    this.foodRepo = foodRepo;
  }
  return _createClass(FoodService, [{
    key: "addFood",
    value: function addFood() {
      return this.foodRepo.addFood();
    }
  }, {
    key: "getAllFoods",
    value: function getAllFoods() {
      return this.foodRepo.getAllFoods();
    }
  }, {
    key: "getFoodById",
    value: function getFoodById() {
      return this.foodRepo.getFoodById();
    }
  }, {
    key: "updateFoodById",
    value: function updateFoodById() {
      return this.foodRepo.updateFoodById();
    }
  }, {
    key: "deleteFoodById",
    value: function deleteFoodById() {
      return this.foodRepo.deleteFoodById();
    }
  }]);
}();
export default FoodService;