import { Router } from "express";
const router = Router();
import {
  addCuisines,
  getAllCuisiness,
  updateCuisinesById,
  getCuisinesById,
  deleteCuisinesById,
} from "../controllers/cuisinesController.js";

router.get("/getAllCuisines", getAllCuisiness);
router.post("/addCuisines", addCuisines);
router.delete("/deleteCuisines/:id", deleteCuisinesById);
router.patch("/updateCuisines/:id", updateCuisinesById);
router.get("/getCuisines/:id", getCuisinesById);

export default router;
