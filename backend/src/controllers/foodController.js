import FoodRepo from "../repo/foodRepo.js";
import FoodService from "../services/foodService.js";

import FoodModel from "../models/foodModel.js";

const foodRepo = new FoodRepo(FoodModel);
const foodService = new FoodService(foodRepo);

export const addFood = foodService.addFood();

export const getAllFoods = foodService.getAllFoods();

export const getFoodById = foodService.getFoodById();

export const updateFoodById = foodService.updateFoodById();

export const deleteFoodById = foodService.deleteFoodById();

export const getFoodsByRestaurant = foodService.getFoodsByRestaurant();
