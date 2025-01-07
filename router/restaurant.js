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
} from "../controllers/restaurantController.js";

router.get("/getAllRestaurants", getAllRestaurants);
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

export default router;
