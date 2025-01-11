import AuthRepository from "../repo/authRepo.js";
import AuthService from "../services/authService.js";

import UserModel from "../models/userModel.js";

const userRepo = new AuthRepository(UserModel);
const authService = new AuthService(userRepo);

export const logOut = authService.logOut();

export const signUp = authService.signUp();

export const logIn = authService.login();

export const protect = authService.protect();

export const restrictTo = authService.restrictTo;

export const forgotPassword = authService.forgotPassword();

export const resetPassword = authService.resetPassword();

export const changePassword = authService.changePassword();

export const updateMe = authService.updateMe();

export const getMe = authService.getMe();

export const deleteMe = authService.deleteMe();

export const refreshToken = authService.processNewToken();
