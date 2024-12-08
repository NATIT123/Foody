import FoodRepo from "../repo/foodRepo.js";
import FoodService from "../services/foodService.js";

import FoodModel from "../models/FoodModel.js";

const foodRepo = new FoodRepo(FoodModel);
const foodService = new FoodService(foodRepo);

export const addFood = async (req, res, next) => {
  try {
    const response = await foodService.addFood(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getAllFoods = async (req, res, next) => {
  try {
    const response = await foodService.getAllFoods(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const response = await foodService.getFoodById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const updateFoodById = async (req, res, next) => {
  try {
    const response = await foodService.updateFoodById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const deleteFoodById = async (req, res, next) => {
  try {
    const response = await foodService.deleteFoodById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};
