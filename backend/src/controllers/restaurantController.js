import RestaurantRepo from "../repo/restaurantRepo.js";
import RestaurantService from "../services/restaurantService.js";

import RestauranModel from "../models/restaurantModel.js";
import CoordinateModel from "../models/coordinateModel.js";
const restaurantRepo = new RestaurantRepo(RestauranModel, CoordinateModel);
const restaurantService = new RestaurantService(restaurantRepo);

export const countRestaurants = restaurantService.countRestaurants();

export const addRestaurant = restaurantService.addRestaurant();

export const getAllRestaurants = restaurantService.getAllRestaurants();

export const getRestaurantById = restaurantService.getRestaurantById();

export const updateRestaurantById = restaurantService.updateRestaurantById();

export const deleteRestaurantById = restaurantService.deleteRestaurantById();

export const getRestaurantByCity = restaurantService.getRestaunrantByCity();

export const getRestaurantTopDeals = restaurantService.getRestaurantTopDeals();

export const getRestaurantByOptions =
  restaurantService.getRestaurantByOptions();

export const getRestaurantByFields = restaurantService.getRestaurantByFields();

export const getNearestRestaurants = restaurantService.getNearestRestaurants();

export const getRestaurantByViews = restaurantService.getRestaurantByViews();

export const findRestaurantsByFields =
  restaurantService.findRestaurantsByFields();

export const getRestaunrantsPending =
  restaurantService.getRestaunrantsPending();

export const updateStatus = restaurantService.updateStatus();

export const getOwnerRestaurants = restaurantService.getOwnerRestaurants();

export const fetchRestaurantsByRate =
  restaurantService.fetchRestaurantsByRate();

export const findRestaurantsOwnerByFields =
  restaurantService.findRestaurantsOwnerByFields();

export const findRestaurantsPendingByFields =
  restaurantService.findRestaurantsPendingByFields();
