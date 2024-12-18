import UserRepository from "../repo/userrepo.js";
import UserService from "../services/userService.js";

import UserModel from "../models/userModel.js";

const userRepo = new UserRepository(UserModel);
const userService = new UserService(userRepo);

export const addUser = userService.addUser();

export const getAllUsers = userService.getAllUsers();

export const getUserById = userService.getUserById();

export const updateUserById = userService.updateUserById();

export const deleteUserById = userService.deleteUserById();
