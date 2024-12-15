import SubCategoryRepo from "../repo/subCategoryRepo.js";
import SubCategoryService from "../services/subCategoryService.js";

import SubCategoryModel from "../models/subCategoryModel.js";

const subCategoryRepo = new SubCategoryRepo(SubCategoryModel);
const subCategoryService = new SubCategoryService(subCategoryRepo);

export const addSubCategory = subCategoryService.addSubCategory();

export const getAllSubCategorys = subCategoryService.getAllSubCategorys();

export const getSubCategoryById = subCategoryService.getSubCategoryById();

export const updateSubCategoryById = subCategoryService.updateSubCategoryById();

export const deleteSubCategoryById = subCategoryService.deleteSubCategoryById();
