class FoodRepository {
  constructor(foodModel) {
    this.foodModel = foodModel;
  }

  addFood(user) {
    return this.foodModel.create(user);
  }

  getAllFoods() {
    return this.foodModel.findAll();
  }

  getFoodById(id) {
    return this.foodModel.findOne({ id });
  }

  updateFoodById(id, user) {
    return this.foodModel.update(id, user);
  }

  deleteFoodById(id) {
    return this.foodModel.delete(id);
  }
}
export default FoodRepository;
