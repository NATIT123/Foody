import CityRepo from "../repo/cityRepo.js";
import CityService from "../services/cityService.js";

import CityModel from "../models/cityModel.js";
const cityRepo = new CityRepo(CityModel);
const cityService = new CityService(cityRepo);

export const addCity = cityService.addCity();

export const getAllCitys = cityService.getAll();

export const getCityById = cityService.getCityById();

export const updateCityById = cityService.updateCityById();

export const deleteCityById = cityService.deleteCityById();
