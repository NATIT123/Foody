import { filterObj, createSendToken } from "../controllers/handleFactory";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import customResourceResponse from "../utils/constant";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";
class AuthRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  logOut() {
    return catchAsync(async (req, res) => {
      res.clearCookie("refreshToken");
      this.userModel.updateUserToken("", req.user._id);
    });
  }

  updateUserToken(refreshToken, _id) {
    return catchAsync(async (req, res) => {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return next(
          new AppError(
            customResourceResponse.notValidId.message,
            customResourceResponse.notValidId.statusCode
          )
        );
      }
      let user = await this.userModel.findById(_id);
      if (!user) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }
      await user.updateOne({ refreshToken });
      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
      });
    });
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
      } else if (req.cookies.refreshToken) {
        token = req.cookies.refreshToken;
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

  restrictTo(...roles) {
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

  updateMe() {
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
        user: updateUser._id,
      });
    });
  }

  processNewToken(refreshToken) {
    return catchAsync(async (req, res) => {
      try {
        jwt.verify(refreshToken, {
          secret: this.configService.get < string > "JWT_REFRESH_TOKEN_SECRET",
        });

        let user = await this.userModel.findUserByToken(refreshToken);
        if (user) {
          createSendToken(user, 201, res);
        } else {
          return next(
            AppError(
              customResourceResponse.jwtNotValid.message,
              customResourceResponse.jwtNotValid.statusCode
            )
          );
        }
      } catch (err) {
        // throw new BadRequestException(
        //   "Refresh token is not valid.Please sign in again"
        // );
        next(err);
      }
    });
  }

  findUserByToken = async (refreshToken) => {
    return await this.userModel.findOne({ refreshToken });
  };

  deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}
export default AuthRepository;
