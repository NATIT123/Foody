import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var AlbumRepository = /*#__PURE__*/function () {
  function AlbumRepository(albumModel) {
    _classCallCheck(this, AlbumRepository);
    this.albumModel = albumModel;
  }
  return _createClass(AlbumRepository, [{
    key: "addAlbum",
    value: function addAlbum() {
      return createOne(this.albumModel);
    }
  }, {
    key: "getAllAlbums",
    value: function getAllAlbums() {
      return getAll(this.albumModel);
    }
  }, {
    key: "getAlbumById",
    value: function getAlbumById() {
      return getOne(this.albumModel, "restaurantId");
    }
  }, {
    key: "updateAlbumById",
    value: function updateAlbumById() {
      return updateOne(this.albumModel);
    }
  }, {
    key: "deleteAlbumById",
    value: function deleteAlbumById() {
      return deleteOne(this.albumModel);
    }
  }]);
}();
export default AlbumRepository;