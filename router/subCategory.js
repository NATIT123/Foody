import { Router } from "express";
const router = Router();
import {
  addSubCategory,
  getAllSubCategorys,
  updateSubCategoryById,
  getSubCategoryById,
  deleteSubCategoryById,
} from "../controllers/subCategoryController.js";

router.get("/getAllSubCategory", getAllSubCategorys);
router.post("/addSubCategory", addSubCategory);
router.delete("/deleteSubCategory/:id", deleteSubCategoryById);
router.patch("/updateSubCategory/:id", updateSubCategoryById);
router.get("/getSubCategory/:id", getSubCategoryById);

export default router;
