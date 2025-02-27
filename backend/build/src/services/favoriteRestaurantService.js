import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var FavoriteRestaurantService = /*#__PURE__*/function () {
  function FavoriteRestaurantService(favoriteRestaurantRepo) {
    _classCallCheck(this, FavoriteRestaurantService);
    this.favoriteRestaurantRepo = favoriteRestaurantRepo;
  }
  return _createClass(FavoriteRestaurantService, [{
    key: "addFavoriteRestaurant",
    value: function addFavoriteRestaurant() {
      return this.favoriteRestaurantRepo.addFavoriteRestaurant();
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.favoriteRestaurantRepo.getAll();
    }
  }, {
    key: "getFavoriteRestaurantById",
    value: function getFavoriteRestaurantById() {
      return this.favoriteRestaurantRepo.getFavoriteRestaurantById();
    }
  }, {
    key: "updateFavoriteRestaurantById",
    value: function updateFavoriteRestaurantById() {
      return this.favoriteRestaurantRepo.updateFavoriteRestaurantById();
    }
  }, {
    key: "deleteFavoriteRestaurantById",
    value: function deleteFavoriteRestaurantById() {
      return this.favoriteRestaurantRepo.deleteFavoriteRestaurantById();
    }
  }, {
    key: "getFavoriteRestaurantsByUserId",
    value: function getFavoriteRestaurantsByUserId() {
      return this.favoriteRestaurantRepo.getFavoriteRestaurantByUserId();
    }
  }, {
    key: "getSavedRestaunrantByUserId",
    value: function getSavedRestaunrantByUserId() {
      return this.favoriteRestaurantRepo.getSavedRestaunrantByUserId();
    }
  }]);
}();
export default FavoriteRestaurantService;