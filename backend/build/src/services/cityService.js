import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var CityService = /*#__PURE__*/function () {
  function CityService(cityRepo) {
    _classCallCheck(this, CityService);
    this.cityRepo = cityRepo;
  }
  return _createClass(CityService, [{
    key: "addCity",
    value: function addCity() {
      return this.cityRepo.addCity();
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.cityRepo.getAll();
    }
  }, {
    key: "getCityById",
    value: function getCityById() {
      return this.cityRepo.getCityById();
    }
  }, {
    key: "updateCityById",
    value: function updateCityById() {
      return this.cityRepo.updateCityById();
    }
  }, {
    key: "deleteCityById",
    value: function deleteCityById() {
      return this.cityRepo.deleteCityById();
    }
  }]);
}();
export default CityService;