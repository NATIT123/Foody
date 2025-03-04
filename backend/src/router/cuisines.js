import { Router } from "express";
const router = Router();
import {
  addCuisines,
  getAllCuisines,
  updateCuisinesById,
  getCuisinesById,
  deleteCuisinesById,
} from "../controllers/cuisinesController.js";
import { protect } from "../controllers/authController.js";

router.get("/getAllCuisines", getAllCuisines);

router.use(protect);
router.post("/addCuisines", addCuisines);
router.delete("/deleteCuisines/:id", deleteCuisinesById);
router.patch("/updateCuisines/:id", updateCuisinesById);
router.get("/getCuisines/:id", getCuisinesById);

export default router;
