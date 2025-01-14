class CategoryService {
  constructor(categoryRepo) {
    this.categoryRepo = categoryRepo;
  }

  addCategory() {
    return this.categoryRepo.addCategory();
  }

  getAll() {
    return this.categoryRepo.getAll();
  }

  getCategoryById() {
    return this.categoryRepo.getCategoryById();
  }

  updateCategoryById() {
    return this.categoryRepo.updateCategoryById();
  }

  deleteCategoryById() {
    return this.categoryRepo.deleteCategoryById();
  }
}

export default CategoryService;
