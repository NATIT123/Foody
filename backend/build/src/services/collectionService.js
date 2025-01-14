import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var CollectionService = /*#__PURE__*/function () {
  function CollectionService(collectionRepo) {
    _classCallCheck(this, CollectionService);
    this.collectionRepo = CollectionRepo;
  }
  return _createClass(CollectionService, [{
    key: "addCollection",
    value: function addCollection() {
      return this.collectionRepo.addCollection();
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.collectionRepo.getAll();
    }
  }, {
    key: "getCollectionById",
    value: function getCollectionById() {
      return this.collectionRepo.getCollectionById();
    }
  }, {
    key: "updateCollectionById",
    value: function updateCollectionById() {
      return this.collectionRepo.updateCollectionById();
    }
  }, {
    key: "deleteCollectionById",
    value: function deleteCollectionById() {
      return this.collectionRepo.deleteCollectionById();
    }
  }]);
}();
export default CollectionService;