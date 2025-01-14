import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var CategoryService = /*#__PURE__*/function () {
  function CategoryService(categoryRepo) {
    _classCallCheck(this, CategoryService);
    this.categoryRepo = categoryRepo;
  }
  return _createClass(CategoryService, [{
    key: "addCategory",
    value: function addCategory() {
      return this.categoryRepo.addCategory();
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.categoryRepo.getAll();
    }
  }, {
    key: "getCategoryById",
    value: function getCategoryById() {
      return this.categoryRepo.getCategoryById();
    }
  }, {
    key: "updateCategoryById",
    value: function updateCategoryById() {
      return this.categoryRepo.updateCategoryById();
    }
  }, {
    key: "deleteCategoryById",
    value: function deleteCategoryById() {
      return this.categoryRepo.deleteCategoryById();
    }
  }]);
}();
export default CategoryService;