import RestaurantRepo from "../repo/restaurantRepo.js";
import RestaurantService from "../services/restaurantService.js";

import RestauranModel from "../models/restaurantModel.js";
const restaurantRepo = new RestaurantRepo(RestauranModel);
const restaurantService = new RestaurantService(restaurantRepo);

export const addRestaurant = restaurantService.addRestaurant();

export const getAllRestaurants = restaurantService.getAllRestaurants();

export const getRestaurantById = restaurantService.getRestaurantById();

export const updateRestaurantById = restaurantService.updateRestaurantById();

export const deleteRestaurantById = restaurantService.deleteRestaurantById();

export const getRestaurantByCity = restaurantService.getRestaunrantByCity();

export const getRestaurantTopDeals = restaurantService.getRestaurantTopDeals();

export const getRestaurantByOptions =
  restaurantService.getRestaurantByOptions();
