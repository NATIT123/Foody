import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var CoordinateRepository = /*#__PURE__*/function () {
  function CoordinateRepository(coordinateModel) {
    _classCallCheck(this, CoordinateRepository);
    this.coordinateModel = coordinateModel;
  }
  return _createClass(CoordinateRepository, [{
    key: "addCoordinate",
    value: function addCoordinate() {
      return createOne(this.coordinateModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.coordinateModel);
    }
  }, {
    key: "getCoordinateById",
    value: function getCoordinateById() {
      return getOne(this.coordinateModel);
    }
  }, {
    key: "updateCoordinateById",
    value: function updateCoordinateById() {
      return updateOne(this.coordinateModel);
    }
  }, {
    key: "deleteCoordinateById",
    value: function deleteCoordinateById() {
      return deleteOne(this.coordinateModel);
    }
  }]);
}();
export default CoordinateRepository;