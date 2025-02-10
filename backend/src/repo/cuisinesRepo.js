import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class CuisinesRepository {
  constructor(cuisinesModel) {
    this.cuisinesModel = cuisinesModel;
  }

  addCuisines() {
    return createOne(this.CuisinesModel);
  }

  getAll() {
    return getAll(this.cuisinesModel);
  }

  getCuisinesById() {
    return getOne(this.cuisinesModel);
  }

  updateCuisinesById() {
    return updateOne(this.cuisinesModel);
  }

  deleteCuisinesById() {
    return deleteOne(this.cuisinesModel);
  }
}
export default CuisinesRepository;
