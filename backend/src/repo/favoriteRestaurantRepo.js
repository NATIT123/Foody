import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class FavoriteRestaurantRepository {
  constructor(favoriteRestaurantModel) {
    this.favoriteRestaurantModel = favoriteRestaurantModel;
  }

  addFavoriteRestaurant() {
    return createOne(this.favoriteRestaurantModel);
  }

  getAll() {
    return getAll(this.favoriteRestaurantModel);
  }

  getFavoriteRestaurantById() {
    return getOne(this.favoriteRestaurantModel);
  }

  updateFavoriteRestaurantById() {
    return updateOne(this.favoriteRestaurantModel);
  }

  deleteFavoriteRestaurantById() {
    return deleteOne(this.favoriteRestaurantModel);
  }
}
export default FavoriteRestaurantRepository;
