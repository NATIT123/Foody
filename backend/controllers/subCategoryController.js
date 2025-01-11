import SubCategoryRepo from "../repo/subCategoryRepo.js";
import SubCategoryService from "../services/subCategoryService.js";

import SubCategoryModel from "../models/subCategoryModel.js";
import CategoryModel from "../models/categoryModel.js";

const subCategoryRepo = new SubCategoryRepo(SubCategoryModel, CategoryModel);
const subCategoryService = new SubCategoryService(subCategoryRepo);

export const addSubCategory = subCategoryService.addSubCategory();

export const getAllSubCategorys = subCategoryService.getAllSubCategorys();

export const getSubCategoryById = subCategoryService.getSubCategoryById();

export const updateSubCategoryById = subCategoryService.updateSubCategoryById();

export const deleteSubCategoryById = subCategoryService.deleteSubCategoryById();

export const getSubCategoryByCategory =
  subCategoryService.getSubCategoryByCategory();
