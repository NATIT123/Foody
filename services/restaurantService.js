class RestaurantService {
  constructor(restaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  addRestaurant() {
    return this.restaurantRepo.addRestaurant();
  }

  getAllRestaurants() {
    return this.restaurantRepo.getAllRestaurants();
  }

  getRestaurantById() {
    return this.restaurantRepo.getRestaurantById();
  }

  updateRestaurantById() {
    return this.restaurantRepo.updateRestaurantById();
  }

  deleteRestaurantById() {
    return this.restaurantRepo.deleteRestaurantById();
  }

  getRestaurantByCity() {
    return this.restaurantRepo.getByCity();
  }
}

export default RestaurantService;
