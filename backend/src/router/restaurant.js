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
  getOwnerRestaurants,
  fetchRestaurantsByRate,
  countRestaurants,
} from "../controllers/restaurantController.js";

import multer from "multer";
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/count", countRestaurants);

router.post("/getAllRestaurants", getAllRestaurants);
router.post("/addRestaurant", upload.single("image"), addRestaurant);
router.delete("/deleteRestaurant/:id", deleteRestaurantById);
router.patch("/updateRestaurant/:id", updateRestaurantById);
router.get("/getRestaurant/:id", getRestaurantById);
router.get("/getOwnerRestaurants/:ownerId", getOwnerRestaurants);
router.get(
  "/getRestaurantByOptions/city/:cityId/category/:categoryId",
  getRestaurantByOptions
);

router.post("/fetchRestaurantsByRate", fetchRestaurantsByRate);

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
