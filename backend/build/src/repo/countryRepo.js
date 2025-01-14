import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { getAll as _getAll, getOne, updateOne, deleteOne, createOne } from "../controllers/handleFactory.js";
var CountryRepository = /*#__PURE__*/function () {
  function CountryRepository(countryModel) {
    _classCallCheck(this, CountryRepository);
    this.countryModel = countryModel;
  }
  return _createClass(CountryRepository, [{
    key: "addCountry",
    value: function addCountry() {
      return createOne(this.countryModel);
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return _getAll(this.countryModel);
    }
  }, {
    key: "getCountryById",
    value: function getCountryById() {
      return getOne(this.countryModel);
    }
  }, {
    key: "updateCountryById",
    value: function updateCountryById() {
      return updateOne(this.countryModel);
    }
  }, {
    key: "deleteCountryById",
    value: function deleteCountryById() {
      return deleteOne(this.countryModel);
    }
  }]);
}();
export default CountryRepository;