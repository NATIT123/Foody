class DistrictService {
  constructor(districtRepo) {
    this.districtRepo = districtRepo;
  }

  addDistrict() {
    return this.districtRepo.addDistrict();
  }

  getAll() {
    return this.districtRepo.getAll();
  }

  getDistrictById() {
    return this.districtRepo.getDistrictById();
  }

  updateDistrictById() {
    return this.districtRepo.updateDistrictById();
  }

  deleteDistrictById() {
    return this.districtRepo.deleteDistrictById();
  }

  getDistrictsByCity() {
    return this.districtRepo.getDistrictsByCity();
  }
}

export default DistrictService;
