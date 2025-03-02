import { Router } from "express";
const router = Router();
import {
  addCategory,
  getAllCategorys,
  updateCategoryById,
  getCategoryById,
  deleteCategoryById,
} from "../controllers/categoryController.js";
import { protect } from "../controllers/authController.js";

router.get("/getAllCategory", getAllCategorys);

router.use(protect);
router.post("/addCategory", addCategory);
router.delete("/deleteCategory/:id", deleteCategoryById);
router.patch("/updateCategory/:id", updateCategoryById);
router.get("/getCategory/:id", getCategoryById);

export default router;
