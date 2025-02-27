import { Router } from "express";
var router = Router();
import { addCuisines, getAllCuisines, updateCuisinesById, getCuisinesById, deleteCuisinesById } from "../controllers/cuisinesController.js";
router.get("/getAllCuisines", getAllCuisines);
router.post("/addCuisines", addCuisines);
router["delete"]("/deleteCuisines/:id", deleteCuisinesById);
router.patch("/updateCuisines/:id", updateCuisinesById);
router.get("/getCuisines/:id", getCuisinesById);
export default router;