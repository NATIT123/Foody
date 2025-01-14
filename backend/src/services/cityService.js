class CityService {
  constructor(cityRepo) {
    this.cityRepo = cityRepo;
  }

  addCity() {
    return this.cityRepo.addCity();
  }

  getAll() {
    return this.cityRepo.getAll();
  }

  getCityById() {
    return this.cityRepo.getCityById();
  }

  updateCityById() {
    return this.cityRepo.updateCityById();
  }

  deleteCityById() {
    return this.cityRepo.deleteCityById();
  }
}

export default CityService;
