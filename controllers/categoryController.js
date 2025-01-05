import CategoryRepo from "../repo/categoryRepo.js";
import CategoryService from "../services/categoryService.js";

import CategoryModel from "../models/categoryModel.js";

const categoryRepo = new CategoryRepo(CategoryModel);
const categoryService = new CategoryService(categoryRepo);

export const addCategory = categoryService.addCategory();

export const getAllCategorys = categoryService.getAll();

export const getCategoryById = categoryService.getCategoryById();

export const updateCategoryById = categoryService.updateCategoryById();

export const deleteCategoryById = categoryService.deleteCategoryById();
