import { Router } from "express";
var router = Router();
import { addFood, getAllFoods, deleteFoodById, updateFoodById, getFoodById, getFoodsByRestaurant } from "../controllers/foodController.js";
import multer from "multer";
var multerStorage = multer.memoryStorage();
var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
var upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
router.get("/getAllFoods", getAllFoods);
router.post("/addFood", addFood);
router["delete"]("/deleteFood/:id", deleteFoodById);
router.patch("/updateFood/:id", upload.single("image"), updateFoodById);
router.get("/getFood/:id", getFoodById);
router.get("/getFoodsByRestaurant/:restaurantId", getFoodsByRestaurant);
export default router;