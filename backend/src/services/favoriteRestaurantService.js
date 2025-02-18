class FavoriteRestaurantService {
  constructor(favoriteRestaurantRepo) {
    this.favoriteRestaurantRepo = favoriteRestaurantRepo;
  }

  addFavoriteRestaurant() {
    return this.favoriteRestaurantRepo.addFavoriteRestaurant();
  }

  getAll() {
    return this.favoriteRestaurantRepo.getAll();
  }

  getFavoriteRestaurantById() {
    return this.favoriteRestaurantRepo.getFavoriteRestaurantById();
  }

  updateFavoriteRestaurantById() {
    return this.favoriteRestaurantRepo.updateFavoriteRestaurantById();
  }

  deleteFavoriteRestaurantById() {
    return this.favoriteRestaurantRepo.deleteFavoriteRestaurantById();
  }

  getFavoriteRestaurantsByUserId() {
    return this.favoriteRestaurantRepo.getFavoriteRestaurantByUserId();
  }

  getSavedRestaunrantByUserId() {
    return this.favoriteRestaurantRepo.getSavedRestaunrantByUserId();
  }
}

export default FavoriteRestaurantService;
