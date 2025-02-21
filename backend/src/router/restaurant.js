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
  getRestaurantByViews,
  findRestaurantsByFields,
  getRestaunrantsPending,
  updateStatus,
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

router.post("/getRestaurantTopDeals", getRestaurantTopDeals);

router.post("/getRestaurantByFields", getRestaurantByFields);

router.post(
  "/getRestaurantByRecommendation/:restaurantId/:userId",
  getRestaurantByRecommendation
);

router.post("/getNearestRestaurants", getNearestRestaurants);
router.post("/getRestaurantByViews", getRestaurantByViews);
router.get("/findRestaurantsByFields", findRestaurantsByFields);
router.get("/getRestaunrantsPending", getRestaunrantsPending);
router.patch("/updateStatus/:restaurantId", updateStatus);
export default router;
