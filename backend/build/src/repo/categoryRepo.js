import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var CategoryRepository = /*#__PURE__*/function () {
  function CategoryRepository(categoryModel) {
    _classCallCheck(this, CategoryRepository);
    this.categoryModel = categoryModel;
  }
  return _createClass(CategoryRepository, [{
    key: "addCategory",
    value: function addCategory() {
      return createOne(this.categoryModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.categoryModel);
    }
  }, {
    key: "getCategoryById",
    value: function getCategoryById() {
      return getOne(this.categoryModel);
    }
  }, {
    key: "updateCategoryById",
    value: function updateCategoryById() {
      return updateOne(this.categoryModel);
    }
  }, {
    key: "deleteCategoryById",
    value: function deleteCategoryById() {
      return deleteOne(this.categoryModel);
    }
  }]);
}();
export default CategoryRepository;