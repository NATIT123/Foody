import CuisinesRepo from "../repo/cuisinesRepo.js";
import CuisinesService from "../services/cuisinesService.js";
import CuisinesModel from "../models/CuisinesModel.js";

const cuisinesRepo = new CuisinesRepo(CuisinesModel);
const cuisinesService = new CuisinesService(cuisinesRepo);

export const addCuisines = cuisinesService.addCuisines();

export const getAllCuisines = cuisinesService.getAllCuisines();

export const getCuisinesById = cuisinesService.getCuisinesById();

export const updateCuisinesById = cuisinesService.updateCuisinesById();

export const deleteCuisinesById = cuisinesService.deleteCuisinesById();
