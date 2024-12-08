import customResourceResponse from "../utils/constant.js";

class FoodService {
  constructor(foodRepo) {
    this.foodRepo = foodRepo;
  }

  async addFood(req) {
    const { name, image, price, amount } = req.body;

    const response = {};
    if (!name || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const food = await this.foodRepo.addFood(name, image, price, amount);

    if (!food) {
      response.message = customResourceResponse.serverError.message;
      response.statusCode = customResourceResponse.serverError.statusCode;
      return response;
    }

    response.message = customResourceResponse.created.message;
    response.statusCode = customResourceResponse.created.statusCode;
    response.data = food._id;

    return response;
  }

  async getAllFoods() {
    const response = {};
    response.data = [];
    const foods = await this.foodRepo.getAllFoods();
    if (!foods) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = foods;
    return response;
  }

  async getFoodById(req) {
    const response = {};
    response.data = {};
    const { id } = req.params;
    const food = await this.foodRepo.getFoodById(id);
    if (!food) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = food;
    return response;
  }

  async updateFoodById(req) {
    const { name, image, price, amount } = req.body;
    const { id } = req.params;
    const response = {};
    if (!name || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const food = await this.foodRepo.getFoodById(id);
    if (!food) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const updatedFood = await this.foodRepo.updateFoodById(id, food);
    if (!updatedFood) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = updatedFood._id;
      return response;
    }
  }

  async deleteFoodById(req) {
    const { id } = req.params;
    const response = {};

    const user = await this.foodRepo.getFoodById(id);
    if (!user) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const deleteFood = await this.foodRepo.deleteFoodById(id);
    if (!deleteFood) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = deleteFood._id;
      return response;
    }
  }
}

export default FoodService;
