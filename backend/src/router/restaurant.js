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
  getNearestRestaurants,
  getRestaurantByViews,
  findRestaurantsByFields,
  getRestaunrantsPending,
  updateStatus,
  getOwnerRestaurants,
  fetchRestaurantsByRate,
  countRestaurants,
  findRestaurantsOwnerByFields,
  findRestaurantsPendingByFields,
} from "../controllers/restaurantController.js";

import multer from "multer";
import { protect } from "../controllers/authController.js";
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
router.post("/fetchRestaurantsByRate", fetchRestaurantsByRate);

router.get("/getRestaurantByCity/city/:cityId", getRestaurantByCity);

router.post("/getRestaurantTopDeals", getRestaurantTopDeals);

router.post("/getRestaurantByFields", getRestaurantByFields);

router.post("/getNearestRestaurants", getNearestRestaurants);
router.post("/getRestaurantByViews", getRestaurantByViews);

router.get(
  "/getRestaurantByOptions/city/:cityId/category/:categoryId",
  getRestaurantByOptions
);
router.get("/getRestaurant/:id", getRestaurantById);

router.use(protect);
router.get("/findRestaurantsByFields", findRestaurantsByFields);
router.post("/addRestaurant", upload.single("image"), addRestaurant);
router.delete("/deleteRestaurant/:id", deleteRestaurantById);
router.patch(
  "/updateRestaurant/:id",
  upload.single("image"),
  updateRestaurantById
);
router.get("/getOwnerRestaurants/:ownerId", getOwnerRestaurants);
router.get("/getRestaunrantsPending", getRestaunrantsPending);
router.patch("/updateStatus/:restaurantId", updateStatus);
router.get(
  "/findRestaurantsOwnerByFields/:ownerId",
  findRestaurantsOwnerByFields
);

router.get("/findRestaurantsPendingByFields", findRestaurantsPendingByFields);
export default router;
