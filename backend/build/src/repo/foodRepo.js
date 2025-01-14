import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var FoodRepository = /*#__PURE__*/function () {
  function FoodRepository(foodModel) {
    _classCallCheck(this, FoodRepository);
    this.foodModel = foodModel;
  }
  return _createClass(FoodRepository, [{
    key: "addFood",
    value: function addFood() {
      return createOne(this.foodModel);
    }
  }, {
    key: "getAllFoods",
    value: function getAllFoods() {
      return getAll(this.foodModel, "restaurantId");
    }
  }, {
    key: "getFoodById",
    value: function getFoodById() {
      return getOne(this.foodModel);
    }
  }, {
    key: "updateFoodById",
    value: function updateFoodById() {
      return updateOne(this.foodModel);
    }
  }, {
    key: "deleteFoodById",
    value: function deleteFoodById() {
      return deleteOne(this.foodModel);
    }
  }]);
}();
export default FoodRepository;