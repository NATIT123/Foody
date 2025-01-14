var catchAsync = function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next)["catch"](function (err) {
      return next(err);
    });
  };
};
export default catchAsync;