import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var CityRepository = /*#__PURE__*/function () {
  function CityRepository(cityModel) {
    _classCallCheck(this, CityRepository);
    this.cityModel = cityModel;
  }
  return _createClass(CityRepository, [{
    key: "addCity",
    value: function addCity() {
      return createOne(this.cityModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.cityModel);
    }
  }, {
    key: "getCityById",
    value: function getCityById() {
      return getOne(this.cityModel, "CountryId");
    }
  }, {
    key: "updateCityById",
    value: function updateCityById() {
      return updateOne(this.cityModel);
    }
  }, {
    key: "deleteCityById",
    value: function deleteCityById() {
      return deleteOne(this.cityModel);
    }
  }]);
}();
export default CityRepository;