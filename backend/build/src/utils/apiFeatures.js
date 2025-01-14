import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
//  ///BUILD QUERY
//   ///1)Filtering
//   const queryObj = { ...req.query };
//   const excludeFields = ['page', 'sort', 'limit', 'fields'];
//   excludeFields.forEach((el) => delete queryObj[queryObj]);
//   // 2) Advanced filtering
//   let queryStr = JSON.stringify(queryObj);
//   console.log(queryStr);
//   ///duration[gte]=5&difficulty=easy=>{difficulty:'easy',duration:{gte:'5'}}
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   console.log(JSON.parse(queryStr));
//   // let tours = await tour.find(JSON.parse(queryStr));
//   let tours = await tour.find();
//   ///3 Pagination
//   let { page, limit, skip } = req.query;
//   page = page * 1 || 1;
//   limit = limit * 1 || 100;
//   skip = (page - 1) * limit;
//   console.log(page, limit, skip);
//   console.log(tours.length);
//   //page3&limit=10 ,1-10, page 1, 11-20, page 2, 21-30 page 3
//   ///Way1
//   // tours = tours.slice(skip, skip + limit);
//   ///Way2
//   tours = await tour.aggregate([
//     { $sort: { pirce: -1 } },
//     { $skip: (page - 1) * limit },
//     { $limit: limit },
//   ]);
//   if (page) {
//     const numTours = await tour.countDocuments();
//     if (skip > numTours) throw new Error('This is page does not exist');
//   }
var APIFeatures = /*#__PURE__*/function () {
  function APIFeatures(query, queryString) {
    _classCallCheck(this, APIFeatures);
    this.query = query;
    this.queryString = queryString;
  }

  // /api/products?price[gte]=100&rating[lt]=4&page=2
  return _createClass(APIFeatures, [{
    key: "filter",
    value: function filter() {
      var queryObj = _objectSpread({}, this.queryString);
      var excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach(function (el) {
        return delete queryObj[el];
      });
      console.log(queryObj);

      // 1B) Advanced filtering
      var queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
        return "$".concat(match);
      });
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
    // /api/products?sort=fullname (ascending order) -fullname(descending order)
  }, {
    key: "sort",
    value: function sort() {
      if (this.queryString.sort) {
        var sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
  }, {
    key: "aggregate",
    value: function aggregate() {
      var pipeline = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.query = this.query.aggregate(pipeline);
      return this;
    }

    //Filter fields with route with selected fields
  }, {
    key: "limitFields",
    value: function limitFields() {
      if (this.queryString.fields) {
        var fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else if (this.queryString._fieldsForExec) {
        var _fields = this.query._fieldsForExec().filter(function (f) {
          return !["createdAt", "_id", "__v"].includes(f);
        });
        this.query = this.query.select(_fields);
      }
      return this;
    }
  }, {
    key: "paginate",
    value: function paginate() {
      var page = this.queryString.page * 1 || 1;
      var limit = this.queryString.limit * 1 || 100;
      var skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }, {
    key: "populate",
    value: function populate() {
      if (this.queryString.populate) {
        var options = this.queryString.populate;
        console.log(options);
        if (options.includes(",")) {
          var option = options.split(",");
          this.query = this.query.populate(option[0]).populate(option[1]);
        } else {
          this.query = this.query.populate(options);
        }
      }
      return this;
    }
  }, {
    key: "where",
    value: function where() {
      if (this.queryString.where) {
        var conditions = JSON.parse(this.queryString.where); // Parse where condition
        this.query = this.query.find(conditions);
      }
      return this;
    }
  }]);
}();
export default APIFeatures;