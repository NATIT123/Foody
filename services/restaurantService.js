import customResourceResponse from "../utils/constant.js";

class RestaurantService {
  constructor(restaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  async addRestaurant(req) {
    const {
      name,
      image,
      address,
      location,
      district,
      area,
      category,
      cusines,
      audiences,
      qualityRate,
      serviceRate,
      postionRate,
      priceRate,
      spaceRate,
      timeOpen,
      priceRange,
    } = req.body;

    const response = {};
    if (!name || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const restaurant = await this.restaurantRepo.addRestaurant(
      name,
      image,
      address,
      location,
      district,
      area,
      category,
      cusines,
      audiences,
      qualityRate,
      serviceRate,
      postionRate,
      priceRate,
      spaceRate,
      timeOpen,
      priceRange
    );

    if (!restaurant) {
      response.message = customResourceResponse.serverError.message;
      response.statusCode = customResourceResponse.serverError.statusCode;
      return response;
    }

    response.message = customResourceResponse.created.message;
    response.statusCode = customResourceResponse.created.statusCode;
    response.data = restaurant._id;

    return response;
  }

  async getAllRestaurants() {
    const response = {};
    response.data = [];
    const restaurants = await this.restaurantRepo.getAllRestaurants();
    if (!restaurants) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = restaurants;
    return response;
  }

  async getRestaurantById(req) {
    const response = {};
    response.data = {};
    const { id } = req.params;
    const restaurant = await this.restaurantRepo.getRestaurantById(id);
    if (!restaurant) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = restaurant;
    return response;
  }

  async updateRestaurantById(req) {
    const {
      name,
      image,
      address,
      location,
      district,
      area,
      category,
      cusines,
      audiences,
      qualityRate,
      serviceRate,
      postionRate,
      priceRate,
      spaceRate,
      timeOpen,
      priceRange,
    } = req.body;
    const { id } = req.params;
    const response = {};
    if (!name || !image) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const restaurant = await this.restaurantRepo.getRestaurantById(id);
    if (!restaurant) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const updatedRestaurant = await this.restaurantRepo.updateRestaurantById(
      id,
      restaurant
    );
    if (!updatedRestaurant) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = updatedRestaurant._id;
      return response;
    }
  }

  async deleteRestaurantById(req) {
    const { id } = req.params;
    const response = {};

    const user = await this.restaurantRepo.getRestaurantById(id);
    if (!user) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const deleteRestaurant = await this.restaurantRepo.deleteRestaurantById(id);
    if (!deleteRestaurant) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = deleteRestaurant._id;
      return response;
    }
  }
}

export default RestaurantService;
