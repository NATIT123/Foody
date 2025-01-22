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

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // /api/products?price[gte]=100&rating[lt]=4&page=2
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log(queryObj);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  // /api/products?sort=fullname (ascending order) -fullname(descending order)
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("createdAt");
    }

    return this;
  }

  aggregate(pipeline = []) {
    this.query = this.query.aggregate(pipeline);
    return this;
  }

  //Filter fields with route with selected fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else if (this.queryString._fieldsForExec) {
      const fields = this.query
        ._fieldsForExec()
        .filter((f) => !["createdAt", "_id", "__v"].includes(f));
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
  populate() {
    if (this.queryString.populate) {
      const options = this.queryString.populate;
      console.log(options);
      if (options.includes(",")) {
        const option = options.split(",");
        this.query = this.query.populate(option[0]).populate(option[1]);
      } else {
        this.query = this.query.populate(options);
      }
    }
    return this;
  }

  where() {
    if (this.queryString.where) {
      const conditions = JSON.parse(this.queryString.where); // Parse where condition
      this.query = this.query.find(conditions);
    }
    return this;
  }
}
export default APIFeatures;
