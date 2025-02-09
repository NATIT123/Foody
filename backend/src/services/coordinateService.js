import customResourceResponse from "../utils/constant.js";

class CoordinateService {
  constructor(coordinateRepo) {
    this.coordinateRepo = coordinateRepo;
  }

  addCoordinate() {
    return this.coordinateRepo.addCoordinate();
  }

  getAllCoordinates() {
    return this.coordinateRepo.getAll();
  }

  getCoordinateById() {
    return this.coordinateRepo.getCoordinateById();
  }

  updateCoordinateById() {
    return this.coordinateRepo.updateCoordinateById();
  }

  deleteCoordinateById() {
    return this.coordinateRepo.deleteCoordinateById();
  }
}

export default CoordinateService;
