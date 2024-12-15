import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class CategoryRepository {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  addCategory() {
    return createOne(this.categoryModel);
  }

  getAll() {
    return getAll(this.categoryModel);
  }

  getCategoryById() {
    return getOne(this.categoryModel);
  }

  updateCategoryById() {
    return updateOne(this.categoryModel);
  }

  deleteCategoryById() {
    return deleteOne(this.categoryModel);
  }
}
export default CategoryRepository;
