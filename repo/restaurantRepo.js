class RestaurantRepository {
  constructor(restaurantModel) {
    this.restaurantModel = restaurantModel;
  }

  async addRestaurant(user) {
    return await this.restaurantModel.create(user);
  }

  async getAllRestaurants() {
    return await this.restaurantModel.findAll();
  }

  async getRestaurantById(id) {
    return await this.restaurantModel.findOne({ id });
  }

  async updateRestaurantById(id, user) {
    return await this.restaurantModel.update(id, user);
  }

  async deleteRestaurantById(id) {
    return await this.restaurantModel.delete(id);
  }
}
export default RestaurantRepository;
