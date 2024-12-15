import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class RestaurantRepository {
  constructor(restaurantModel) {
    this.restaurantModel = restaurantModel;
  }

  addRestaurant() {
    return createOne(this.restaurantModel);
  }

  getAllRestaurants() {
    return getAll(this.restaurantModel);
  }

  getRestaurantById() {
    return getOne(this.restaurantModel);
  }

  updateRestaurantById() {
    return updateOne(this.restaurantModel);
  }

  deleteRestaurantById() {
    return deleteOne(this.restaurantModel);
  }
}
export default RestaurantRepository;
