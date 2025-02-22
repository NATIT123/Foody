import UserRepository from "../repo/userRepo.js";
import UserService from "../services/userService.js";

import UserModel from "../models/userModel.js";

const userRepo = new UserRepository(UserModel);
const userService = new UserService(userRepo);

export const addUser = userService.addUser();

export const getAllUsers = userService.getAllUsers();

export const getUserById = userService.getUserById();

export const updateUserById = userService.updateUserById();

export const deleteUserById = userService.deleteUserById();

export const uploadPhoto = userService.uploadPhoto();

export const getUserDetails = userService.getUsersDetail();

export const getAllDetails = userService.getAllDetails();

export const findUsersByFields = userService.findUsersByFields();

export const getChatBotResponse = userService.getChatBotResponse();

export const findUsersByRole = userService.findUsersByRole();
