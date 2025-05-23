import CoordinateRepo from "../repo/coordinateRepo.js";
import CoordinateService from "../services/coordinateService.js";
import CoordinateModel from "../models/coordinateModel.js";
var coordinateRepo = new CoordinateRepo(CoordinateModel);
var coordinateService = new CoordinateService(coordinateRepo);
export var addCoordinate = coordinateService.addCoordinate();
export var getAllCoordinates = coordinateService.getAllCoordinates();
export var getCoordinateById = coordinateService.getCoordinateById();
export var updateCoordinateById = coordinateService.updateCoordinateById();
export var deleteCoordinateById = coordinateService.deleteCoordinateById();