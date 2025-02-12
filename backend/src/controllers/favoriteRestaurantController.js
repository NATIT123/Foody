import FavoriteRestaurantRepo from "../repo/favoriteRestaurantRepo.js";
import FavoriteRestaurantService from "../services/favoriteRestaurantService.js";

import FavoriteRestaurantModel from "../models/favoriteRestaurantModel.js";

const favoriteRestaurantRepo = new FavoriteRestaurantRepo(
  FavoriteRestaurantModel
);
const favoriteRestaurantService = new FavoriteRestaurantService(
  favoriteRestaurantRepo
);

export const addFavoriteRestaurant =
  favoriteRestaurantService.addFavoriteRestaurant();

export const getAllFavoriteRestaurants = favoriteRestaurantService.getAll();

export const getFavoriteRestaurantById =
  favoriteRestaurantService.getFavoriteRestaurantById();

export const updateFavoriteRestaurantById =
  favoriteRestaurantService.updateFavoriteRestaurantById();

export const deleteFavoriteRestaurantById =
  favoriteRestaurantService.deleteFavoriteRestaurantById();

export const getFavoriteRestaurantByUserId =
  favoriteRestaurantService.getFavoriteRestaurantsByUserId();
