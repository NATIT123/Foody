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
import { protect } from "../controllers/authController.js";

router.use(protect);
router.get("/getAllFavoriteRestaurant", getAllFavoriteRestaurants);
router.post("/addFavoriteRestaurant", addFavoriteRestaurant);
router.delete("/deleteFavoriteRestaurant/:id", deleteFavoriteRestaurantById);
router.patch("/updateFavoriteRestaurant/:id", updateFavoriteRestaurantById);
router.get("/getFavoriteRestaurant/:id", getFavoriteRestaurantById);
router.post(
  "/getFavoriteRestaurantByUserId/:userId",
  getFavoriteRestaurantByUserId
);

router.get("/getSavedRestaurantByUserId/:userId", getSavedRestaunrantByUserId);

export default router;
