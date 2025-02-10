import CoordinateRepo from "../repo/coordinateRepo.js";
import CoordinateService from "../services/coordinateService.js";

import CoordinateModel from "../models/coordinateModel.js";

const coordinateRepo = new CoordinateRepo(CoordinateModel);
const coordinateService = new CoordinateService(coordinateRepo);

export const addCoordinate = coordinateService.addCoordinate();

export const getAllCoordinates = coordinateService.getAllCoordinates();

export const getCoordinateById = coordinateService.getCoordinateById();

export const updateCoordinateById = coordinateService.updateCoordinateById();

export const deleteCoordinateById = coordinateService.deleteCoordinateById();
