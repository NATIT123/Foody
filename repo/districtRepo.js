import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class DistrictRepository {
  constructor(districtModel) {
    this.districtModel = districtModel;
  }

  addDistrict() {
    return createOne(this.districtModel);
  }

  getAll() {
    return getAll(this.districtModel);
  }

  getDistrictById() {
    return getOne(this.districtModel);
  }

  updateDistrictById() {
    return updateOne(this.districtModel);
  }

  deleteDistrictById() {
    return deleteOne(this.districtModel);
  }
}
export default DistrictRepository;
