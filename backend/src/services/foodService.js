class FoodService {
  constructor(foodRepo) {
    this.foodRepo = foodRepo;
  }
  addFood() {
    return this.foodRepo.addFood();
  }

  getAllFoods() {
    return this.foodRepo.getAllFoods();
  }

  getFoodById() {
    return this.foodRepo.getFoodById();
  }

  updateFoodById() {
    return this.foodRepo.updateFoodById();
  }

  deleteFoodById() {
    return this.foodRepo.deleteFoodById();
  }

  getFoodsByRestaurant() {
    return this.foodRepo.getFoodSByRestaurant();
  }
}

export default FoodService;
