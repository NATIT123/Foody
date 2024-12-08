import RestaurantRepo from "../repo/restaurantRepo.js";
import RestaurantService from "../services/restaurantService.js";

import RestauranModel from "../models/restaurantModel.js";

const restaurantRepo = new RestaurantRepo(RestauranModel);
const restaurantService = new RestaurantService(restaurantRepo);

export const addRestaurant = async (req, res, next) => {
  try {
    const response = await restaurantService.addRestaurant(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getAllRestaurants = async (req, res, next) => {
  try {
    const response = await restaurantService.getAllRestaurants(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const response = await restaurantService.getRestaurantById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const updateRestaurantById = async (req, res, next) => {
  try {
    const response = await restaurantService.updateRestaurantById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const deleteRestaurantById = async (req, res, next) => {
  try {
    const response = await restaurantService.deleteRestaurantById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};
