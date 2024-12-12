import mongoose from "mongoose";
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
import validator from "validator";
import bcrypt from "bcryptjs";
const UserDetailSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please tell us your fullname"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: String,
    password: {
      type: String,
      required: [true, "Plese provide your password"],
      minlength: 8,
      ////Not show password
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Plase provide your confirm password"],
      validate: {
        ///This only works on CREATE AND SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the same",
      },
    },
    refreshToken: String,
    photo: {
      type: String,
      default: "default.jpg",
    },
    address: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

UserDetailSchema.pre("save", async function (next) {
  ///Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  ///Hash the password with round of 12
  this.password = await bcrypt.hash(this.password, saltRounds);

  ///Delete confirmPassowrd field
  this.confirmPassword = undefined;
  next();
});

UserDetailSchema.pre("save", function (next) {
  //This.isNew = using for create a new document
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserDetailSchema.pre(/^find/, function (next) {
  ////this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

UserDetailSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserDetailSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

UserDetailSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const UserModel = mongoose.model("users", UserDetailSchema);

export default UserModel;
