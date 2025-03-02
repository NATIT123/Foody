class RestaurantService {
  constructor(restaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  countRestaurants() {
    return this.restaurantRepo.countRestaurants();
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

  getRestaurantByOptions() {
    return this.restaurantRepo.getByOptions();
  }

  getRestaunrantByCity() {
    return this.restaurantRepo.getByCity();
  }

  getRestaurantTopDeals() {
    return this.restaurantRepo.getTopDeals();
  }

  getRestaurantByFields() {
    return this.restaurantRepo.getRestaurantByFields();
  }

  getNearestRestaurants() {
    return this.restaurantRepo.getNearestRestaurants();
  }

  getRestaurantByViews() {
    return this.restaurantRepo.getRestaurantByViews();
  }
  findRestaurantsByFields() {
    return this.restaurantRepo.findRestaurantsByFields();
  }
  getRestaunrantsPending() {
    return this.restaurantRepo.getRestaunrantsPending();
  }
  updateStatus() {
    return this.restaurantRepo.updateStatus();
  }
  getOwnerRestaurants() {
    return this.restaurantRepo.getOwnerRestaurants();
  }
  fetchRestaurantsByRate() {
    return this.restaurantRepo.fetchRestaurantsByRate();
  }
}

export default RestaurantService;
