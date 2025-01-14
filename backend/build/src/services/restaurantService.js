import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var RestaurantService = /*#__PURE__*/function () {
  function RestaurantService(restaurantRepo) {
    _classCallCheck(this, RestaurantService);
    this.restaurantRepo = restaurantRepo;
  }
  return _createClass(RestaurantService, [{
    key: "addRestaurant",
    value: function addRestaurant() {
      return this.restaurantRepo.addRestaurant();
    }
  }, {
    key: "getAllRestaurants",
    value: function getAllRestaurants() {
      return this.restaurantRepo.getAllRestaurants();
    }
  }, {
    key: "getRestaurantById",
    value: function getRestaurantById() {
      return this.restaurantRepo.getRestaurantById();
    }
  }, {
    key: "updateRestaurantById",
    value: function updateRestaurantById() {
      return this.restaurantRepo.updateRestaurantById();
    }
  }, {
    key: "deleteRestaurantById",
    value: function deleteRestaurantById() {
      return this.restaurantRepo.deleteRestaurantById();
    }
  }, {
    key: "getRestaurantByOptions",
    value: function getRestaurantByOptions() {
      return this.restaurantRepo.getByOptions();
    }
  }, {
    key: "getRestaunrantByCity",
    value: function getRestaunrantByCity() {
      return this.restaurantRepo.getByCity();
    }
  }, {
    key: "getRestaurantTopDeals",
    value: function getRestaurantTopDeals() {
      return this.restaurantRepo.getTopDeals();
    }
  }, {
    key: "getRestaurantByFileds",
    value: function getRestaurantByFileds() {
      return this.restaurantRepo.getRestaurantByFields();
    }
  }]);
}();
export default RestaurantService;