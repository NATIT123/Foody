import mongoose from "mongoose";

const UserDetailSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    password: String,
    image: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

UserDetailSchema.pre("save", async function (next) {
  ///Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  ///Hash the password with round of 12
  this.password = await bcrypt.hash(this.password, 12);

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

const UserModel = mongoose.model("Users", UserDetailSchema);

export default UserModel;
