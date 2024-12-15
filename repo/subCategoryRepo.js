import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class SubCategoryRepository {
  constructor(subCategoryModel) {
    this.subCategoryModel = subCategoryModel;
  }

  addsubCategory() {
    return createOne(this.subCategoryModel);
  }

  getAll() {
    return getAll(this.subCategoryModel);
  }

  getsubCategoryById() {
    return getOne(this.subCategoryModel);
  }

  updatesubCategoryById() {
    return updateOne(this.subCategoryModel);
  }

  deletesubCategoryById() {
    return deleteOne(this.subCategoryModel);
  }
}
export default SubCategoryRepository;
