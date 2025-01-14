import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var CountryService = /*#__PURE__*/function () {
  function CountryService(countryRepo) {
    _classCallCheck(this, CountryService);
    this.countryRepo = countryRepo;
  }
  return _createClass(CountryService, [{
    key: "addCountry",
    value: function addCountry() {
      return this.countryRepo.addCountry();
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.countryRepo.getAll();
    }
  }, {
    key: "getCountryById",
    value: function getCountryById() {
      return this.countryRepo.getCountryById();
    }
  }, {
    key: "updateCountryById",
    value: function updateCountryById() {
      return this.countryRepo.updateCountryById();
    }
  }, {
    key: "deleteCountryById",
    value: function deleteCountryById() {
      return this.countryRepo.deleteCountryById();
    }
  }]);
}();
export default CountryService;