import UserRepository from "../repo/userrepo.js";
import UserService from "../services/userService.js";

import User from "../models/userModel.js";

const userRepo = new UserRepository(User);
const userService = new UserService(userRepo);

export const addUser = async (req, res, next) => {
  try {
    const response = await userService.addUser(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const response = await userService.getAllUser(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const response = await userService.getUserById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const response = await userService.updateUserById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const response = await userService.updateUserById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};
