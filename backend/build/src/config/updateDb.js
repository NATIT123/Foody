import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import fs from "fs";
import csv from "csv-parser";
export function updateDatabase(_x) {
  return _updateDatabase.apply(this, arguments);
}
function _updateDatabase() {
  _updateDatabase = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(restaurantModel) {
    var csvFilePath,
      results,
      _args2 = arguments;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          csvFilePath = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "sorted_restaurants.csv";
          results = [];
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            fs.createReadStream(csvFilePath).pipe(csv()).on("data", function (row) {
              results.push(row);
            }).on("end", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
              var _i, _results, row, name, average_score;
              return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _i = 0, _results = results;
                  case 2:
                    if (!(_i < _results.length)) {
                      _context.next = 14;
                      break;
                    }
                    row = _results[_i];
                    name = row.name, average_score = row.average_score;
                    if (!(!name || !average_score)) {
                      _context.next = 8;
                      break;
                    }
                    console.log("B\u1ECF qua d\xF2ng thi\u1EBFu d\u1EEF li\u1EC7u:", row);
                    return _context.abrupt("continue", 11);
                  case 8:
                    _context.next = 10;
                    return restaurantModel.updateOne({
                      name: name
                    }, {
                      $set: {
                        averageScore: parseFloat(average_score) || 0
                      }
                    });
                  case 10:
                    console.log("Updated: ".concat(name, " - Average Score: ").concat(average_score));
                  case 11:
                    _i++;
                    _context.next = 2;
                    break;
                  case 14:
                    console.log("Cập nhật hoàn tất!");
                    resolve();
                    _context.next = 21;
                    break;
                  case 18:
                    _context.prev = 18;
                    _context.t0 = _context["catch"](0);
                    reject(_context.t0);
                  case 21:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[0, 18]]);
            }))).on("error", function (error) {
              return reject(error);
            });
          }));
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _updateDatabase.apply(this, arguments);
}