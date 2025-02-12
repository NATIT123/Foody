import { Router } from "express";
const router = Router();
import {
  addRestaurant,
  getAllRestaurants,
  deleteRestaurantById,
  updateRestaurantById,
  getRestaurantById,
  getRestaurantByOptions,
  getRestaurantByCity,
  getRestaurantTopDeals,
  getRestaurantByFields,
  getRestaurantByRecommendation,
  getNearestRestaurants,
} from "../controllers/restaurantController.js";

router.post("/getAllRestaurants", getAllRestaurants);
router.post("/addRestaurant", addRestaurant);
router.delete("/deleteRestaurant/:id", deleteRestaurantById);
router.patch("/updateRestaurant/:id", updateRestaurantById);
router.get("/getRestaurant/:id", getRestaurantById);

router.get(
  "/getRestaurantByOptions/city/:cityId/category/:categoryId",
  getRestaurantByOptions
);

router.get("/getRestaurantByCity/city/:cityId", getRestaurantByCity);

router.get("/getRestaurantTopDeals/city/:cityId", getRestaurantTopDeals);

router.get("/getRestaurantByFileds/city/:cityId", getRestaurantByFields);

router.get(
  "/getRestaurantByRecommendation/:restaurantId",
  getRestaurantByRecommendation
);

router.post("/getNearestRestaurants", getNearestRestaurants);

export default router;
