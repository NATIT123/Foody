import { Router } from "express";
const router = Router();
import {
  addSubCategory,
  getAllSubCategorys,
  updateSubCategoryById,
  getSubCategoryById,
  deleteSubCategoryById,
  getSubCategoryByCategory,
  getSubCategoryByCategorySpecific,
} from "../controllers/subCategoryController.js";

router.get("/getAllSubCategory", getAllSubCategorys);
router.post("/addSubCategory", addSubCategory);
router.delete("/deleteSubCategory/:id", deleteSubCategoryById);
router.patch("/updateSubCategory/:id", updateSubCategoryById);
router.get("/getSubCategory/:id", getSubCategoryById);
router.get("/getSubCategoryByCategory/:categoryId", getSubCategoryByCategory);
router.get(
  "/getSubCategoryByCategorySpecific",
  getSubCategoryByCategorySpecific
);

export default router;
