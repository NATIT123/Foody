import { Router } from "express";
const router = Router();
import {
  addRestaurant,
  getAllRestaurants,
  deleteRestaurantById,
  updateRestaurantById,
  getRestaurantById,
  getRestaurantByCity,
} from "../controllers/restaurantController.js";

router.get("/getAllRestaurants", getAllRestaurants);
router.post("/addRestaurant", addRestaurant);
router.delete("/deleteRestaurant/:id", deleteRestaurantById);
router.patch("/updateRestaurant/:id", updateRestaurantById);
router.get("/getRestaurant/:id", getRestaurantById);

router.get("/getRestaurantByCity/:cityId", getRestaurantByCity);

export default router;
