import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import mongoose from "mongoose";
var saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
var UserDetailSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please tell us your fullname"]
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  phone: String,
  password: {
    type: String,
    required: [true, "Plese provide your password"],
    minlength: 8,
    ////Not show password
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "Plase provide your confirm password"],
    validate: {
      ///This only works on CREATE AND SAVE!!!
      validator: function validator(el) {
        return el === this.password;
      },
      message: "Password are not the same"
    }
  },
  refreshToken: String,
  photo: {
    type: String,
    "default": "default.jpg"
  },
  address: {
    type: String,
    required: [true, "Please tell us your address"]
  },
  active: {
    type: Boolean,
    "default": true
  },
  role: {
    type: String,
    "enum": ["user", "admin", "owner"],
    "default": "user"
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});
UserDetailSchema.pre("save", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(next) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", next());
        case 2:
          _context.next = 4;
          return bcrypt.hash(this.password, saltRounds);
        case 4:
          this.password = _context.sent;
          ///Delete confirmPassowrd field
          this.confirmPassword = undefined;
          next();
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
UserDetailSchema.pre("save", function (next) {
  //This.isNew = using for create a new document
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
UserDetailSchema.pre(/^find/, function (next) {
  ////this points to the current query
  this.find({
    active: {
      $ne: false
    }
  });
  next();
});
UserDetailSchema.methods.correctPassword = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(candidatePassword, userPassword) {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return bcrypt.compare(candidatePassword, userPassword);
        case 2:
          return _context2.abrupt("return", _context2.sent);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
UserDetailSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    var changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
UserDetailSchema.methods.createPasswordResetToken = function () {
  var resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  console.log({
    resetToken: resetToken
  }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
var UserModel = mongoose.model("users", UserDetailSchema);
export default UserModel;