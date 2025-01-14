import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
///Enviroment Variables
console.log(path.resolve(__dirname, "./config.env"));
dotenv.config({
  path: path.resolve(__dirname, "../config.env")
});
console.log(process.env.URL);
var mongoUrl = process.env.URL.replace("<PASSWORD>", process.env.PASSWORD_MONGODB) || process.env.LOCAL_URL;
var connectDb = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return mongoose.connect(mongoUrl, {});
        case 3:
          console.log("Connect Db");
          _context.next = 10;
          break;
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error("Error connecting to MongoDB:", _context.t0);
          process.exit(1); // Exit process with failure
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return function connectDb() {
    return _ref.apply(this, arguments);
  };
}();
export default connectDb;