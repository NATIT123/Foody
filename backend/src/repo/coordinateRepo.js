import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class CoordinateRepository {
  constructor(coordinateModel) {
    this.coordinateModel = coordinateModel;
  }

  addCoordinate() {
    return createOne(this.coordinateModel);
  }

  getAll() {
    return getAll(this.coordinateModel);
  }

  getCoordinateById() {
    return getOne(this.coordinateModel);
  }

  updateCoordinateById() {
    return updateOne(this.coordinateModel);
  }

  deleteCoordinateById() {
    return deleteOne(this.coordinateModel);
  }
}
export default CoordinateRepository;
