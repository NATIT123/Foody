import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class CountryRepository {
  constructor(countryModel) {
    this.countryModel = countryModel;
  }

  addCountry() {
    return createOne(this.countryModel);
  }

  getAll() {
    return getAll(this.countryModel);
  }

  getCountryById() {
    return getOne(this.countryModel);
  }

  updateCountryById() {
    return updateOne(this.countryModel);
  }

  deleteCountryById() {
    return deleteOne(this.countryModel);
  }
}
export default CountryRepository;
