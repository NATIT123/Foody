import { Router } from "express";
const router = Router();
import {
  addFavoriteRestaurant,
  getAllFavoriteRestaurants,
  updateFavoriteRestaurantById,
  getFavoriteRestaurantById,
  deleteFavoriteRestaurantById,
  getFavoriteRestaurantByUserId,
  getSavedRestaunrantByUserId,
} from "../controllers/favoriteRestaurantController.js";

router.get("/getAllFavoriteRestaurant", getAllFavoriteRestaurants);
router.post("/addFavoriteRestaurant", addFavoriteRestaurant);
router.delete("/deleteFavoriteRestaurant/:id", deleteFavoriteRestaurantById);
router.patch("/updateFavoriteRestaurant/:id", updateFavoriteRestaurantById);
router.get("/getFavoriteRestaurant/:id", getFavoriteRestaurantById);
router.get(
  "/getFavoriteRestaurantByUserId/:userId",
  getFavoriteRestaurantByUserId
);

router.get("/getSavedRestaurantByUserId/:userId", getSavedRestaunrantByUserId);

export default router;
