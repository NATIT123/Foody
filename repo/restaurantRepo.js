class RestaurantRepository {
  constructor(restaurantModel) {
    this.restaurantModel = restaurantModel;
  }

  addRestaurant(user) {
    return this.restaurantModel.create(user);
  }

  getAllRestaurants() {
    return this.restaurantModel.findAll();
  }

  getRestaurantById(id) {
    return this.restaurantModel.findOne({ id });
  }

  updateRestaurantById(id, user) {
    return this.restaurantModel.update(id, user);
  }

  deleteRestaurantById(id) {
    return this.restaurantModel.delete(id);
  }
}
export default RestaurantRepository;
