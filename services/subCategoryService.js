class SubCategoryService {
  constructor(subCategoryRepo) {
    this.subCategoryRepo = subCategoryRepo;
  }

  addSubCategory() {
    return this.subCategoryRepo.addsubCategory();
  }

  getAllSubCategorys() {
    return this.subCategoryRepo.getAll();
  }

  getSubCategoryById() {
    return this.subCategoryRepo.getsubCategoryById();
  }

  updateSubCategoryById() {
    return this.subCategoryRepo.updatesubCategoryById();
  }

  deleteSubCategoryById() {
    return this.subCategoryRepo.deletesubCategoryById();
  }

  getSubCategoryByCategory() {
    return this.subCategoryRepo.getSubCategoryByCategory();
  }
}

export default SubCategoryService;
