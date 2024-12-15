class CountryService {
  constructor(countryRepo) {
    this.countryRepo = countryRepo;
  }

  addCountry() {
    return this.countryRepo.addCountry();
  }

  getAll() {
    return this.countryRepo.getAll();
  }

  getCountryById() {
    return this.countryRepo.getCountryById();
  }

  updateCountryById() {
    return this.countryRepo.updateCountryById();
  }

  deleteCountryById() {
    return this.countryRepo.deleteCountryById();
  }
}

export default CountryService;
