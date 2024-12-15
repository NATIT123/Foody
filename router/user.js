import { Router } from "express";
const router = Router();
import {
  addUser,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

import {
  signUp,
  logIn,
  forgotPassword,
  changePassword,
  protect,
  resetPassword,
  restrictTo,
  logOut,
  getMe,
  updateMe,
  deleteMe,
  refreshToken,
} from "../controllers/authController.js";

router.post("/signUp", signUp);
router.post("/login", logIn);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// ///Protect all route
router.use(protect);

router.patch("/updatePassword", changePassword);
router.get("/me", getMe, getUserById);

router.patch("/updateMe", updateMe);

router.delete("/deleteMe", deleteMe);

router.post("/logOut", logOut);

router.post("/refresh", refreshToken);

router.use(restrictTo("admin"));

router.get("/getAllUsers", getAllUsers);
router.post("/addUser", addUser);
router.delete("/deleteUser/:id", deleteUserById);
router.patch("/updateUser/:id", updateUserById);
router.get("/getUser/:id", getUserById);

export default router;
