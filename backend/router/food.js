import { Router } from "express";
const router = Router();
import {
  addFood,
  getAllFoods,
  deleteFoodById,
  updateFoodById,
  getFoodById,
} from "../controllers/foodController.js";

router.get("/getAllFoods", getAllFoods);
router.post("/addFood", addFood);
router.delete("/deleteFood/:id", deleteFoodById);
router.patch("/updateFood/:id", updateFoodById);
router.get("/getFood/:id", getFoodById);

export default router;
