import { Router } from "express";
const router = Router();
import {
  addFood,
  getAllFoods,
  deleteFoodById,
  updateFoodById,
  getFoodById,
  getFoodsByRestaurant,
} from "../controllers/foodController.js";
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

router.post("/addFood", upload.single("image"), addFood);
router.get("/getFoodsByRestaurant/:restaurantId", getFoodsByRestaurant);

router.use(protect);
router.get("/getAllFoods", getAllFoods);
router.delete("/deleteFood/:id", deleteFoodById);
router.patch("/updateFood/:id", upload.single("image"), updateFoodById);
router.get("/getFood/:id", getFoodById);

export default router;
