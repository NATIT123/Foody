import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import customResourceResponse from "../utils/constant.js";
var CoordinateService = /*#__PURE__*/function () {
  function CoordinateService(coordinateRepo) {
    _classCallCheck(this, CoordinateService);
    this.coordinateRepo = coordinateRepo;
  }
  return _createClass(CoordinateService, [{
    key: "addCoordinate",
    value: function addCoordinate() {
      return this.coordinateRepo.addCoordinate();
    }
  }, {
    key: "getAllCoordinates",
    value: function getAllCoordinates() {
      return this.coordinateRepo.getAll();
    }
  }, {
    key: "getCoordinateById",
    value: function getCoordinateById() {
      return this.coordinateRepo.getCoordinateById();
    }
  }, {
    key: "updateCoordinateById",
    value: function updateCoordinateById() {
      return this.coordinateRepo.updateCoordinateById();
    }
  }, {
    key: "deleteCoordinateById",
    value: function deleteCoordinateById() {
      return this.coordinateRepo.deleteCoordinateById();
    }
  }]);
}();
export default CoordinateService;