import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import customResourceResponse from "../utils/constant.js";
var AlbumService = /*#__PURE__*/function () {
  function AlbumService(albumRepo) {
    _classCallCheck(this, AlbumService);
    this.albumRepo = albumRepo;
  }
  return _createClass(AlbumService, [{
    key: "addAlbum",
    value: function addAlbum() {
      return this.albumRepo.addAlbum();
    }
  }, {
    key: "getAllAlbums",
    value: function getAllAlbums() {
      return this.albumRepo.getAllAlbums();
    }
  }, {
    key: "getAlbumById",
    value: function getAlbumById() {
      return this.albumRepo.getAlbumById();
    }
  }, {
    key: "updateAlbumById",
    value: function updateAlbumById() {
      return this.albumRepo.updateAlbumById();
    }
  }, {
    key: "deleteAlbumById",
    value: function deleteAlbumById() {
      return this.albumRepo.deleteAlbumById();
    }
  }, {
    key: "getAlbumsByRestaurant",
    value: function getAlbumsByRestaurant() {
      return this.albumRepo.getAlbumsByRestaurant();
    }
  }]);
}();
export default AlbumService;