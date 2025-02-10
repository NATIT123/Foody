import { Router } from "express";
const router = Router();
import {
  addFavoriteRestaurant,
  getAllFavoriteRestaurants,
  updateFavoriteRestaurantById,
  getFavoriteRestaurantById,
  deleteFavoriteRestaurantById,
} from "../controllers/favoriteRestaurantController.js";

router.get("/getAllFavoriteRestaurant", getAllFavoriteRestaurants);
router.post("/addFavoriteRestaurant", addFavoriteRestaurant);
router.delete("/deleteFavoriteRestaurant/:id", deleteFavoriteRestaurantById);
router.patch("/updateFavoriteRestaurant/:id", updateFavoriteRestaurantById);
router.get("/getFavoriteRestaurant/:id", getFavoriteRestaurantById);

export default router;
