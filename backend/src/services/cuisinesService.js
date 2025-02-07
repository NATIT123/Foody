class CuisinesService {
  constructor(cuisinesRepo) {
    this.cuisinesRepo = cuisinesRepo;
  }

  addCuisines() {
    return this.cuisinesRepo.addCuisines();
  }

  getAllCuisines() {
    return this.cuisinesRepo.getAll();
  }

  getCuisinesById() {
    return this.cuisinesRepo.getCuisinesById();
  }

  updateCuisinesById() {
    return this.cuisinesRepo.updateCuisinesById();
  }

  deleteCuisinesById() {
    return this.cuisinesRepo.deleteCuisinesById();
  }
}

export default CuisinesService;
