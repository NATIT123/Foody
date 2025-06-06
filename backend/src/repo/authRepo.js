import {
  filterObj,
  createSendToken,
  updateUserToken,
} from "../controllers/handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import customResourceResponse from "../utils/constant.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";
import Email from "../utils/email.js";
class AuthRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  logOut = () => updateUserToken(this.userModel, "");

  signUp = () =>
    catchAsync(async (req, res, next) => {
      const newUser = await this.userModel.create(req.body);
      const url = `${req.protocol}://localhost:3001/`;
      await new Email(newUser, url).sendWelcome();
      createSendToken(this.userModel, newUser, 201, res);
    });

  login = () =>
    catchAsync(async (req, res, next) => {
      const { email, password } = req.body;

      // 1) Check if email and password exist
      if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
      }
      // 2) Check if user exists && password is correct
      const user = await this.userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new AppError("User Not Found", 404));
      }

      console.log(await user.correctPassword(password, user.password));

      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
      }

      // 3) If everything ok, send token to client
      createSendToken(this.userModel, user, 200, res);
    });

  protect = () =>
    catchAsync(async (req, res, next) => {
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

  restrictTo = (...roles) =>
    catchAsync((req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    });

  forgotPassword = () =>
    catchAsync(async (req, res, next) => {
      if (!req.body.email) {
        return next(new AppError("Please input your email", 404));
      }
      ///Get user based on POST email
      const user = await this.userModel.findOne({ email: req.body.email });
      if (!user) {
        return next(new AppError("There is no user with email address", 404));
      }

      //Generate the random reset token
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      //Send it to user's email

      try {
        const resetURL = `${req.protocol}://localhost:3001/changePassword/${resetToken}`;

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

  checkPassword = () =>
    catchAsync(async (req, res, next) => {
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

      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        data: [],
      });
    });

  resetPassword = () =>
    catchAsync(async (req, res, next) => {
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
      user.password = undefined;
      createSendToken(this.userModel, user, 201, res);
    });

  changePassword = () =>
    catchAsync(async (req, res, next) => {
      ///Get user from collection
      const user = await this.userModel
        .findById(req.params.id)
        .select("+password");
      if (!user) {
        return next(
          new AppError(
            customResourceResponse.recordNotFound.message,
            customResourceResponse.recordNotFound.statusCode
          )
        );
      }
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
      createSendToken(this.userModel, user, 201, res);
    });

  updateMe = () =>
    catchAsync(async (req, res, next) => {
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
      const filterBody = filterObj(req.body, "address");
      const updateUser = await this.userModel.findByIdAndUpdate(
        req.params.id,
        filterBody,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        data: updateUser._id,
      });
    });

  processNewToken = () =>
    catchAsync(async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken, {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        });

        let user = await this.findUserByToken(refreshToken);
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
        return next(
          AppError("Refresh token is not valid.Please sign in again", 500)
        );
      }
    });

  findUserByToken = async (refreshToken) => {
    return await this.userModel.findOne({ refreshToken });
  };

  deleteMe = () =>
    catchAsync(async (req, res, next) => {
      await this.userModel.findByIdAndUpdate(req.params.id, { active: false });

      res.status(customResourceResponse.success.statusCode).json({
        message: customResourceResponse.success.message,
        status: "success",
        data: null,
      });
    });

  getMe = () => (req, res, next) => {
    console.log("getMe middleware called");
    req.params.id = req.user.id;
    next();
  };
}
export default AuthRepository;
