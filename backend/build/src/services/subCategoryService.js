import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var SubCategoryService = /*#__PURE__*/function () {
  function SubCategoryService(subCategoryRepo) {
    _classCallCheck(this, SubCategoryService);
    this.subCategoryRepo = subCategoryRepo;
  }
  return _createClass(SubCategoryService, [{
    key: "addSubCategory",
    value: function addSubCategory() {
      return this.subCategoryRepo.addsubCategory();
    }
  }, {
    key: "getAllSubCategorys",
    value: function getAllSubCategorys() {
      return this.subCategoryRepo.getAll();
    }
  }, {
    key: "getSubCategoryById",
    value: function getSubCategoryById() {
      return this.subCategoryRepo.getsubCategoryById();
    }
  }, {
    key: "updateSubCategoryById",
    value: function updateSubCategoryById() {
      return this.subCategoryRepo.updatesubCategoryById();
    }
  }, {
    key: "deleteSubCategoryById",
    value: function deleteSubCategoryById() {
      return this.subCategoryRepo.deletesubCategoryById();
    }
  }, {
    key: "getSubCategoryByCategory",
    value: function getSubCategoryByCategory() {
      return this.subCategoryRepo.getSubCategoryByCategory();
    }
  }, {
    key: "getSubCategoryByCategorySpecific",
    value: function getSubCategoryByCategorySpecific() {
      return this.subCategoryRepo.getSubCategoryByCategorySpecific();
    }
  }]);
}();
export default SubCategoryService;