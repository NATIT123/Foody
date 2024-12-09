class FoodRepository {
  constructor(foodModel) {
    this.foodModel = foodModel;
  }

 async addFood(user) {
    return await this.foodModel.create(user);
  }

  async getAllFoods() {
    return await this.foodModel.findAll();
  }

  async getFoodById(id) {
    return await this.foodModel.findOne({ id });
  }

  async updateFoodById(id, user) {
    return await this.foodModel.update(id, user);
  }

  async deleteFoodById(id) {
    return await this.foodModel.delete(id);
  }
}
export default FoodRepository;
