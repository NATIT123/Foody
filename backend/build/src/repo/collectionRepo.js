import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var CollectionRepository = /*#__PURE__*/function () {
  function CollectionRepository(collectionModel) {
    _classCallCheck(this, CollectionRepository);
    this.collectionModel = collectionModel;
  }
  return _createClass(CollectionRepository, [{
    key: "addCollection",
    value: function addCollection() {
      return createOne(this.collectionModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.collectionModel);
    }
  }, {
    key: "getCollectionById",
    value: function getCollectionById() {
      return getOne(this.collectionModel);
    }
  }, {
    key: "updateCollectionById",
    value: function updateCollectionById() {
      return updateOne(this.collectionModel);
    }
  }, {
    key: "deleteCollectionById",
    value: function deleteCollectionById() {
      return deleteOne(this.collectionModel);
    }
  }]);
}();
export default CollectionRepository;