import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
class FoodRepository {
  constructor(foodModel) {
    this.foodModel = foodModel;
  }

  addFood() {
    return createOne(this.foodModel);
  }

  getAllFoods() {
    return getAll(this.foodModel, "restaurantId");
  }

  getFoodById() {
    return getOne(this.foodModel);
  }

  updateFoodById() {
    return updateOne(this.foodModel);
  }

  deleteFoodById() {
    return deleteOne(this.foodModel);
  }
}
export default FoodRepository;
