import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class CityRepository {
  constructor(cityModel) {
    this.cityModel = cityModel;
  }

  addCity() {
    return createOne(this.cityModel);
  }

  getAll() {
    return getAll(this.cityModel);
  }

  getCityById() {
    return getOne(this.cityModel);
  }

  updateCityById() {
    return updateOne(this.cityModel);
  }

  deleteCityById() {
    return deleteOne(this.cityModel);
  }
}
export default CityRepository;
