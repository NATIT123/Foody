import AuthRepository from "../repo/userrepo.js";
import AuthService from "../services/authService.js";

import userModel from "../models/userModel.js";

const userRepo = new AuthRepository(userModel);
const authService = new AuthService(userRepo);

export const logOut = authService.logOut();

export const signUp = authService.signUp();

export const logIn = authService.login();

export const protect = authService.protect();

export const restrictTo = authService.restrictTo();

export const forgotPassword = authService.forgotPassword();

export const resetPassword = authService.resetPassword();

export const changePassword = authService.changePassword();

export const updateMe = authService.updateUser();

export const getMe = authService.getMe();

export const deleteMe = authService.deleteMe();
