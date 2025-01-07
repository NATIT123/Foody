import DistrictRepo from "../repo/districtRepo.js";
import DistrictService from "../services/districtService.js";

import DistrictModel from "../models/districtModel.js";

const districtRepo = new DistrictRepo(DistrictModel);
const districtService = new DistrictService(districtRepo);

export const addDistrict = districtService.addDistrict();

export const getAllDistricts = districtService.getAll();

export const getDistrictById = districtService.getDistrictById();

export const updateDistrictById = districtService.updateDistrictById();

export const deleteDistrictById = districtService.deleteDistrictById();

export const getDistrictsByCity = districtService.getDistrictsByCity();
