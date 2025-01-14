import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var DistrictService = /*#__PURE__*/function () {
  function DistrictService(districtRepo) {
    _classCallCheck(this, DistrictService);
    this.districtRepo = districtRepo;
  }
  return _createClass(DistrictService, [{
    key: "addDistrict",
    value: function addDistrict() {
      return this.districtRepo.addDistrict();
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return this.districtRepo.getAll();
    }
  }, {
    key: "getDistrictById",
    value: function getDistrictById() {
      return this.districtRepo.getDistrictById();
    }
  }, {
    key: "updateDistrictById",
    value: function updateDistrictById() {
      return this.districtRepo.updateDistrictById();
    }
  }, {
    key: "deleteDistrictById",
    value: function deleteDistrictById() {
      return this.districtRepo.deleteDistrictById();
    }
  }, {
    key: "getDistrictsByCity",
    value: function getDistrictsByCity() {
      return this.districtRepo.getDistrictsByCity();
    }
  }]);
}();
export default DistrictService;