import { filterObj, createSendToken } from "../controllers/handleFactory";

class AuthRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  logOut() {
    return (req, res) => {
      res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.status(200).json({
        status: "success",
      });
    };
  }

  signUp() {
    return catchAsync(async (req, res, next) => {
      const newUser = await this.userModel.create(req.body);

      const url = `${req.protocol}://${req.get("host")}/me`;
      await new Email(newUser, url).sendWelcome();
      createSendToken(newUser, 201, res);
    });
  }

  login() {
    return catchAsync(async (req, res, next) => {
      const { email, password } = req.body;

      // 1) Check if email and password exist
      if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
      }
      // 2) Check if user exists && password is correct
      const user = await this.userModel.findOne({ email }).select("+password");

      console.log(await user.correctPassword(password, user.password));

      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
      }

      // 3) If everything ok, send token to client
      createSendToken(user, 200, res);
    });
  }

  protect() {
    return catchAsync(async (req, res, next) => {
      /////Getting token and check of it's there
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }
      console.log(token);

      if (!token) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access",
            401
          )
        );
      }

      //Verification token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECERT
      );

      ///Check if users is exist
      const freshUser = await this.userModel.findById(decoded.id);
      if (!freshUser) {
        return next(
          new AppError(
            "The user beloging to this token does no longer exist",
            401
          )
        );
      }

      ///Check if user changed password after the token was issued
      if (freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password!", 401));
      }

      ///Grant access to protected route
      req.user = freshUser;
      res.locals.user = freshUser;
      next();
    });
  }

  isLoggedIn() {
    return catchAsync(async (req, res, next) => {
      if (req.cookies.jwt) {
        //Verification token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECERT
        );

        ///Check if users is exist
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
          return next();
        }

        ///Check if user changed password after the token was issued
        if (freshUser.changePasswordAfter(decoded.iat)) {
          return next();
        }
        ///Grant access to protected route
        res.locals.user = freshUser;
        // req.user = freshUser;
        return next();
      }

      next();
    });
  }

  restricTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    };
  }

  forgotPassword() {
    catchAsync(async (req, res, next) => {
      ///Get user based on POST email
      const user = await this.userModel.findOne({ email: req.body.email });
      if (!user) {
        return next(new AppError("There is no user with email address", 404));
      }

      //Generate the random reset token
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      //Send it to user's email
      const resetURL = `${req.protocol}://̀${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}`;

      try {
        const resetURL = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/users/resetPassword/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
          status: "success",
          message: "Token sent to email",
        });
      } catch (err) {
        console.log(err.message);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
          new AppError(
            "There was an error sending the email. Try again later!",
            500
          )
        );
      }
    });
  }

  resetPassword() {
    return catchAsync(async (req, res, next) => {
      ///Get user based on the token
      const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await this.userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      ///If token has not experied,and there is user,set the new password
      if (!user) {
        return next(new AppError("Token is invalid or has expeired", 400));
      }

      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: true });

      //update changePasswordAt property for the user

      ///Log the user in, send JWT
      createSendToken(user, 201, res);
    });
  }

  changePassword() {
    return catchAsync(async (req, res, next) => {
      ///Get user from collection
      const user = await this.userModel
        .findById(req.params.id)
        .select("+password");

      ///Check if POSTED current password is correct
      const correct = await user.correctPassword(
        req.body.password,
        user.password
      );
      if (!correct) {
        return next(new AppError("Your current password is wrong", 401));
      }

      ///If so, update password
      user.password = req.body.newPassword;
      user.confirmPassword = req.body.confirmPassword;
      await user.save();

      ////Log user in,send JWT
      createSendToken(user, 201, res);
    });
  }

  updateUser() {
    return catchAsync(async (req, res, next) => {
      ////11Crate Error if user POSTs password data
      if (req.body.password || req.body.confirmPassword) {
        return next(
          new AppError(
            "This route is not for password updates. Please use /changePassword.",
            400
          )
        );
      }

      ///Update user document
      ///Filter out unwanted fields names that are not allowed to be updated
      const filterBody = filterObj(req.body, "name", "email");
      const updateUser = await this.userModel.findByIdAndUpdate(
        req.user.id,
        filterBody,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: "success",
        user: updateUser,
      });
    });
  }
}
export default AuthRepository;
